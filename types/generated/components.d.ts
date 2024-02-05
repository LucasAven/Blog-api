import type { Schema, Attribute } from '@strapi/strapi';

export interface SeoSeo extends Schema.Component {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
    description: '';
  };
  attributes: {
    page_title: Attribute.String;
    page_description: Attribute.Text;
    keywords: Attribute.Text;
    og_title: Attribute.String & Attribute.Required;
    og_description: Attribute.Text & Attribute.Required;
  };
}

export interface SocialMediaSocialMedia extends Schema.Component {
  collectionName: 'components_social_media_social_medias';
  info: {
    displayName: 'Social Media';
  };
  attributes: {
    youtube: Attribute.String;
    twitter: Attribute.String;
    instagram: Attribute.String;
    linkedin: Attribute.String;
    github: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'seo.seo': SeoSeo;
      'social-media.social-media': SocialMediaSocialMedia;
    }
  }
}
