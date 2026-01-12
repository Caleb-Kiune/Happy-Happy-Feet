import { Instagram, Facebook } from "lucide-react";
import TikTok from "@/components/icons/TikTok";
import { CATEGORY_VALUES } from "./types";

export const PRODUCT_SIZES = ["37", "38", "39", "40", "41", "42"];

export const PRODUCT_CATEGORIES = CATEGORY_VALUES;

export const CONTACT_INFO = {
    phoneDisplay: "0720 823 387",       // For UI display
    phoneInternational: "+254720823387", // For tel: links
    whatsapp: "254720823387",           // Digits only for wa.me links
    email: "happyhappysteps@yahoo.com"  // Placeholder/Existing
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

export const SIZE_GUIDE_DATA = [
    { cm: "23.0", eu: "36", cn: "230", us: "6", uk: "3.5" },
    { cm: "23.5", eu: "37", cn: "235", us: "6.5", uk: "4" },
    { cm: "24.0", eu: "38", cn: "240", us: "7.5", uk: "5" },
    { cm: "24.5", eu: "39", cn: "245", us: "8.5", uk: "6" },
    { cm: "25.0", eu: "40", cn: "250", us: "9", uk: "6.5" },
    { cm: "25.5", eu: "41", cn: "255", us: "9.5", uk: "7.5" },
    { cm: "26.0", eu: "42", cn: "260", us: "10", uk: "8" },
];
