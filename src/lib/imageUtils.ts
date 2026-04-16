/**
 * Load an image from a URL and return an HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

/**
 * Convert an image File to WebP format and optionally apply a watermark.
 * @param file - The image file to convert
 * @param addWatermark - Whether to add the Villa Tatilinde watermark (default: true)
 */
export async function convertToWebP(file: File, addWatermark = true): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const img = await loadImage(event.target?.result as string);

                // Define max dimensions
                const MAX_SIZE = 1920;
                let finalWidth = img.width;
                let finalHeight = img.height;

                // Scale down if image is larger than MAX_SIZE
                if (finalWidth > MAX_SIZE || finalHeight > MAX_SIZE) {
                    if (finalWidth > finalHeight) {
                        finalHeight = Math.floor((finalHeight / finalWidth) * MAX_SIZE);
                        finalWidth = MAX_SIZE;
                    } else {
                        finalWidth = Math.floor((finalWidth / finalHeight) * MAX_SIZE);
                        finalHeight = MAX_SIZE;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = finalWidth;
                canvas.height = finalHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                // Draw the original image scaled to final dimensions
                ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

                // Apply watermark if enabled
                if (addWatermark) {
                    try {
                        const watermark = await loadImage("/images/watermark.png");

                        // The watermark size was increased by %80.
                        // Originally 30% of height (0.3), now 54% of height (0.54)
                        const wmHeight = finalHeight * 0.54;
                        const wmWidth = (watermark.width / watermark.height) * wmHeight;

                        // Position: center of the image
                        const x = (finalWidth - wmWidth) / 2;
                        const y = (finalHeight - wmHeight) / 2;

                        // Draw with semi-transparency
                        ctx.globalAlpha = 0.6;
                        ctx.drawImage(watermark, x, y, wmWidth, wmHeight);
                        ctx.globalAlpha = 1.0;
                    } catch (wmErr) {
                        // If watermark fails to load, continue without it
                        console.warn("Watermark could not be loaded, skipping:", wmErr);
                    }
                }

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Canvas to Blob failed"));
                            return;
                        }
                        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const webpFile = new File([blob], fileName, {
                            type: "image/webp",
                        });
                        resolve(webpFile);
                    },
                    "image/webp",
                    0.85 // WebP quality (slightly higher to preserve watermark clarity)
                );
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
    });
}
