import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  shareToSocial(
    platform: 'facebook' | 'twitter' | 'linkedin',
    url: string,
    title: string,
    summary?: string
  ) {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    window.open(shareUrls[platform], '_blank');
  }
  constructor() {}
}
