import { Instagram, Facebook } from "lucide-react";
import TikTok from "@/components/icons/TikTok";
import { CATEGORY_VALUES } from "./types";

export const PRODUCT_SIZES = ["37", "38", "39", "40", "41", "42"];

export const PRODUCT_CATEGORIES = CATEGORY_VALUES;

export const CONTACT_INFO = {
    phoneDisplay: "0720 823 387",       // For UI display
    phoneInternational: "+254720823387", // For tel: links
    whatsapp: "254720823387",           // Digits only for wa.me links
    email: "hello@happyhappyfeet.com"   // Placeholder/Existing
};

export const SOCIAL_LINKS = [
    {
        id: "facebook",
        name: "Facebook",
        url: "https://www.facebook.com/share/14UmWji4Axi/",
        icon: Facebook
    },
    {
        id: "tiktok",
        name: "TikTok",
        url: "https://vm.tiktok.com/ZMHE4M976tU3C-vw84y/",
        icon: TikTok
    },
    {
        id: "instagram",
        name: "Instagram",
        url: "https://www.instagram.com/happy_happy_.feet?igsh=MTNlajR4ZHVlcGtodA==",
        icon: Instagram
    }
];
