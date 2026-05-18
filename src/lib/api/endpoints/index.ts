// Feature-based exports (new API)
export * from './auth';
export * from './comics';
export * from './posts';
export * from './core';
export * from './introduction';
export * from './marketing';

// Imports for backward-compatible re-exports
import { authEndpoints } from './auth';
import {
    comicEndpoints,
    chapterEndpoints,
    comicCategoryEndpoints,
    comicCommentEndpoints,
    comicReviewEndpoints,
    comicStatsEndpoints,
    bookmarkEndpoints,
    readingHistoryEndpoints,
    followEndpoints,
} from './comics';
import { postEndpoints, postCategoryEndpoints, postTagEndpoints, postCommentEndpoints } from './posts';
import {
    userManagementEndpoints,
    roleEndpoints,
    permissionEndpoints,
    groupEndpoints,
    menuEndpoints,
    systemConfigEndpoints,
    contentTemplateEndpoints,
    locationEndpoints,
    notificationEndpoints,
} from './core';
import {
    aboutEndpoints,
    certificateEndpoints,
    contactEndpoints,
    faqEndpoints,
    galleryEndpoints,
    partnerEndpoints,
    projectEndpoints,
    staffEndpoints,
    testimonialEndpoints,
    homeEndpoints,
} from './introduction';
import { bannerEndpoints, bannerLocationEndpoints } from './marketing';
import { uploadEndpoints } from './core';
import { analyticsEndpoints } from './comics';

// Backward-compatible exports
export const adminEndpoints = {
    users: userManagementEndpoints.admin,
    posts: postEndpoints.admin,
    postCategories: postCategoryEndpoints.admin,
    postTags: postTagEndpoints.admin,
    roles: roleEndpoints.admin,
    permissions: permissionEndpoints.admin,
    groups: groupEndpoints.admin,
    aboutSections: aboutEndpoints.admin,
    projects: projectEndpoints.admin,
    gallery: galleryEndpoints.admin,
    partners: partnerEndpoints.admin,
    certificates: certificateEndpoints.admin,
    faqs: faqEndpoints.admin,
    testimonials: testimonialEndpoints.admin,
    staff: staffEndpoints.admin,
    banners: bannerEndpoints.admin,
    bannerLocations: bannerLocationEndpoints.admin,
    contacts: contactEndpoints.admin,
    contentTemplates: contentTemplateEndpoints.admin,
    menus: menuEndpoints.admin,
    userMenus: { list: menuEndpoints.user.list },
    enums: systemConfigEndpoints.admin.enums,
    systemConfigs: {
        general: systemConfigEndpoints.admin.general,
        getByGroup: systemConfigEndpoints.admin.getByGroup,
        update: systemConfigEndpoints.admin.update,
        updateGeneral: systemConfigEndpoints.admin.updateGeneral,
        updateEmail: systemConfigEndpoints.admin.updateEmail,
    },
    postComments: postCommentEndpoints.admin,
    comicComments: comicCommentEndpoints.admin,
    comicCategories: comicCategoryEndpoints.admin,
    comics: comicEndpoints.admin,
    chapters: chapterEndpoints.admin,
    comicStats: comicStatsEndpoints.admin,
    analytics: analyticsEndpoints.admin,
    reviews: comicReviewEndpoints.admin,
    location: locationEndpoints.admin,
    notifications: notificationEndpoints.admin,
} as const;

export const userEndpoints = {
    auth: {
        login: authEndpoints.login,
        register: authEndpoints.register,
        sendOtpRegister: authEndpoints.sendOtpRegister,
        sendOtpForgotPassword: authEndpoints.sendOtpForgotPassword,
        resetPassword: authEndpoints.resetPassword,
        logout: authEndpoints.logout,
        logoutAll: authEndpoints.logoutAll,
        refresh: authEndpoints.refresh,
        google: authEndpoints.google,
    },
    profile: authEndpoints.profile,
    groups: groupEndpoints.user,
    uploads: uploadEndpoints,
    menus: menuEndpoints.user,
    comments: comicCommentEndpoints.user,
    reviews: comicReviewEndpoints.user,
    bookmarks: bookmarkEndpoints.user,
    readingHistory: readingHistoryEndpoints.user,
    follows: followEndpoints.user,
    notifications: notificationEndpoints.user,
} as const;

export const publicEndpoints = {
    posts: postEndpoints.public,
    postCategories: postCategoryEndpoints.public,
    postTags: postTagEndpoints.public,
    contacts: contactEndpoints.public,
    systemConfigs: systemConfigEndpoints.public,
    banners: bannerEndpoints.public,
    homepage: homeEndpoints.public.homepage,
    projects: projectEndpoints.public,
    aboutSections: aboutEndpoints.public,
    staff: staffEndpoints.public,
    testimonials: testimonialEndpoints.public,
    partners: partnerEndpoints.public,
    gallery: galleryEndpoints.public,
    certificates: certificateEndpoints.public,
    faqs: faqEndpoints.public,
    reviews: comicReviewEndpoints.public,
    comments: comicCommentEndpoints.public,
    comics: comicEndpoints.public,
    comicCategories: comicCategoryEndpoints.public,
    menus: menuEndpoints.public,
    location: locationEndpoints.public,
    cache: systemConfigEndpoints.cache,
    auth: userEndpoints.auth,
    users: {
        me: userEndpoints.profile.me,
        updateProfile: userEndpoints.profile.update,
        changePassword: userEndpoints.profile.changePassword,
    },
} as const;

export type AdminEndpoints = typeof adminEndpoints;
export type PublicEndpoints = typeof publicEndpoints;
export type UserEndpoints = typeof userEndpoints;
