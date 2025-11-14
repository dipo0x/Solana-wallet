import { Routes } from '../types/route/app.type';
import indexRoutes from '../modules/index/index.route';
import userRoutes from '../modules/user/user.route';
import accountRoutes from '../modules/account/account.route';
import walletRoutes from '../modules/wallet/wallet.route';
import assetRoutes from '../modules/asset/asset.route';

export const appRoutes: Routes = [
    {
        path: "/",
        router: indexRoutes,
    },
    {
        path: "/user",
        router: userRoutes,
    },
    {
        path: "/account",
        router: accountRoutes,
    },
    {
        path: "/wallet",
        router: walletRoutes,
    },
    {
        path: "/asset",
        router: assetRoutes,
    }
    
];
