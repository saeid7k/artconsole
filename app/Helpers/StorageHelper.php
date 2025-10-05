<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Get the file access path or temporary URL based on disk type.
     *
     * @param string $disk
     * @param string $filePath
     * @param int $expirySeconds
     * @return string
     */
    public static function getFileAccessPath(string $disk, string $filePath, int $expirySeconds = 3600): string
    {
        // For S3, return a temporary URL
        if (in_array($disk, ['s3'])) {
            return Storage::disk($disk)->temporaryUrl($filePath, now()->addSeconds($expirySeconds));
        }

        // For public disks, return the public URL
        if (in_array($disk, ['public'])) {
            return Storage::disk($disk)->url($filePath);
        }

        // For local disks, return the absolute path
        return Storage::disk($disk)->path($filePath);
    }
}
