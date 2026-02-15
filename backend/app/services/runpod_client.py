"""
White Dwarf — RunPod Serverless API Wrapper
Alternative cloud inference backend using RunPod.
"""
import httpx
import asyncio
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class RunPodClient:
    """
    Clean wrapper for RunPod serverless endpoints.
    Same interface as ReplicateClient for interchangeability.
    """

    BASE_URL = "https://api.runpod.ai/v2"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def _check_key(self):
        if not self.api_key:
            raise ValueError(
                "RUNPOD_API_KEY is not set. "
                "Please add it to backend/.env"
            )

    async def _run_endpoint(
        self, endpoint_id: str, input_data: Dict[str, Any]
    ) -> Dict:
        """Submit a job to a RunPod serverless endpoint."""
        self._check_key()

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/{endpoint_id}/runsync",
                headers=self.headers,
                json={"input": input_data},
            )
            response.raise_for_status()
            data = response.json()

            # RunPod runsync returns result directly if fast enough
            if data.get("status") == "COMPLETED":
                return data.get("output", {})

            # Otherwise poll
            job_id = data.get("id")
            if job_id:
                return await self._poll_job(endpoint_id, job_id)

            return data

    async def _poll_job(
        self, endpoint_id: str, job_id: str, max_wait: int = 300, interval: int = 3
    ) -> Dict:
        """Poll a RunPod job until completion."""
        elapsed = 0

        async with httpx.AsyncClient(timeout=30) as client:
            while elapsed < max_wait:
                response = await client.get(
                    f"{self.BASE_URL}/{endpoint_id}/status/{job_id}",
                    headers=self.headers,
                )
                response.raise_for_status()
                data = response.json()

                status = data.get("status")
                if status == "COMPLETED":
                    return data.get("output", {})
                elif status == "FAILED":
                    raise RuntimeError(f"RunPod job failed: {data.get('error', 'Unknown')}")

                await asyncio.sleep(interval)
                elapsed += interval

        raise TimeoutError(f"RunPod job timed out after {max_wait}s")

    async def generate_mesh(
        self, endpoint_id: str, prompt: str, image_url: Optional[str] = None
    ) -> str:
        """Generate a 3D mesh via RunPod. Returns the mesh file URL."""
        input_data = {"prompt": prompt}
        if image_url:
            input_data["image"] = image_url

        logger.info(f"[RunPod] Mesh generation: '{prompt[:50]}...'")
        result = await self._run_endpoint(endpoint_id, input_data)

        if isinstance(result, str):
            return result
        elif isinstance(result, dict):
            return result.get("mesh_url", result.get("output", str(result)))
        raise RuntimeError(f"Unexpected RunPod output: {result}")

    async def generate_texture(
        self, endpoint_id: str, prompt: str, depth_image_url: str
    ) -> str:
        """Generate texture via RunPod. Returns the texture image URL."""
        input_data = {
            "prompt": prompt,
            "depth_image": depth_image_url,
        }

        logger.info(f"[RunPod] Texture generation: '{prompt[:50]}...'")
        result = await self._run_endpoint(endpoint_id, input_data)

        if isinstance(result, str):
            return result
        elif isinstance(result, dict):
            return result.get("texture_url", result.get("output", str(result)))
        raise RuntimeError(f"Unexpected RunPod texture output: {result}")
