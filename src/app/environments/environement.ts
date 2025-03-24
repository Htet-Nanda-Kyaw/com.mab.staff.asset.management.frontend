export const environment = {
    baseURL: 'http://172.30.10.90:7505/asm-service/api', //uat
    // baseURL: 'http://localhost:8080/api', // dev
    // baseURL: 'http://172.30.4.49:7004/asm-service/api', //prod
    loginURL: '/auth/login',
    profileURL: '/user/profile',
    getAllRefCategories: '/ref_asset_category/search_all',
    saveAssets: '/asset/save',
    getAllRefLaptops: '/ref_laptop/search_all',
    getAllRefDesktops: '/ref_desktop/search_all',
    getAllRefMonitors: '/ref_external_monitor/search_all',
    getAllRefHDD: '/ref_hard_disk/search_all',
    getAllRefPrinters:'/ref_printer/search_all',
    getAllRefScanners:'/ref_scanner/search_all',
    getAllRefUPS:'/ref_ups/search_all',
    updatePassword: '/user/update_password',
    adminUpdatePassword: '/user/admin/update_password',
    getAllAssets:'/asset/search_all',
    getUsersWithoutAssets:'/user/get/all/without/assets',
    getAllRefCopiers:'/ref_copier/search_all',
}