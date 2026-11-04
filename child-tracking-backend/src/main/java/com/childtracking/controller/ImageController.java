package com.childtracking.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    private final Cloudinary cloudinary;

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    public ImageController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload an image to Cloudinary (persistent cloud storage).
     * Returns the full Cloudinary URL so it can be stored in the database
     * and served directly without going through this backend.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only JPG and PNG files are allowed"));
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must not exceed 5MB"));
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "mcrs",
                            "resource_type", "image"
                    )
            );
            String url = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");
            return ResponseEntity.ok(Map.of(
                    "filename", url,
                    "publicId", publicId,
                    "message", "Image uploaded to Cloudinary"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Serve a locally-stored image (fallback for images uploaded before Cloudinary).
     * New images are served directly from Cloudinary via the URL stored in the DB.
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = baseDir.resolve(filename).normalize();
            if (!filePath.startsWith(baseDir)) {
                return ResponseEntity.badRequest().build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            String ct = filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(ct))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
