"""
White Dwarf — Replicate API Wrapper
Handles all cloud inference calls to Replicate.com
"""
import httpx
import asyncio
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class ReplicateClient:
    """Clean wrapper for Replicate API endpoints with retry logic and polling."""

    BASE_URL = "https://api.replicate.com/v1"

    def __init__(self, api_token: str):
        self.api_token = api_token
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
        }

    def _check_token(self):
        if not self.api_token:
            raise ValueError(
                "REPLICATE_API_TOKEN is not set. "
                "Please add it to backend/.env"
            )

    async def _create_prediction(
        self, model_version: str, input_data: Dict[str, Any]
    ) -> Dict:
        """Create a prediction and return the initial response."""
        self._check_token()

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/predictions",
                headers=self.headers,
                json={
                    "version": model_version.split(":")[-1] if ":" in model_version else model_version,
                    "input": input_data,
                },
            )
            response.raise_for_status()
            return response.json()

    async def _poll_prediction(
        self, prediction_url: str, max_wait: int = 300, interval: int = 3
    ) -> Dict:
        """Poll a prediction until it completes, fails, or times out."""
        elapsed = 0

        async with httpx.AsyncClient(timeout=30) as client:
            while elapsed < max_wait:
                response = await client.get(prediction_url, headers=self.headers)
                response.raise_for_status()
                data = response.json()

                status = data.get("status")
                if status == "succeeded":
                    return data
                elif status in ("failed", "canceled"):
                    error = data.get("error", "Unknown error")
                    raise RuntimeError(f"Prediction failed: {error}")

                await asyncio.sleep(interval)
                elapsed += interval

        raise TimeoutError(f"Prediction timed out after {max_wait}s")

    async def generate_mesh(
        self, model_version: str, prompt: str, image_url: Optional[str] = None
    ) -> str:
        """
        Generate a 3D mesh from text (and optionally an image).
        Returns the URL of the generated mesh file.
        """
        input_data = {"prompt": prompt}
        if image_url:
            input_data["image"] = image_url

        logger.info(f"Starting mesh generation: '{prompt[:50]}...'")
        prediction = await self._create_prediction(model_version, input_data)

        poll_url = prediction.get("urls", {}).get("get", prediction.get("url", ""))
        result = await self._poll_prediction(poll_url)

        output = result.get("output")
        if isinstance(output, str):
            return output
        elif isinstance(output, list) and len(output) > 0:
            return output[0]
        elif isinstance(output, dict):
            # Some models return {"mesh": "url", ...}
            return output.get("mesh", output.get("url", str(output)))
        else:
            raise RuntimeError(f"Unexpected output format: {output}")

    async def generate_texture(
        self,
        model_version: str,
        prompt: str,
        depth_image_url: str,
        num_samples: int = 1,
    ) -> str:
        """
        Generate a texture using ControlNet Depth.
        Returns the URL of the generated texture image.
        """
        input_data = {
            "prompt": prompt,
            "image": depth_image_url,
            "num_samples": str(num_samples),
            "image_resolution": "512",
            "ddim_steps": 30,
            "strength": 1.0,
        }

        logger.info(f"Starting texture generation: '{prompt[:50]}...'")
        prediction = await self._create_prediction(model_version, input_data)

        poll_url = prediction.get("urls", {}).get("get", prediction.get("url", ""))
        result = await self._poll_prediction(poll_url)

        output = result.get("output")
        if isinstance(output, list) and len(output) > 0:
            return output[0]
        elif isinstance(output, str):
            return output
        else:
            raise RuntimeError(f"Unexpected texture output: {output}")
