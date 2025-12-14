import router from '@/router';
import { isEmpty } from 'lodash-es';

export function updateRouteUrl(query) {
    query = Object.assign({}, query);
    query.t =+ new Date();
    router.replace({
        name: router.currentRoute.value.name,
        query: {
            querySchema: encodeURIComponent(JSON.stringify(query)),
        },
    });
}

export const transformUrlQuery = (params) => {
    const curRoute = router.currentRoute;
    if (isEmpty(curRoute.value.query?.querySchema || {})) {
        return params;
    }
    const querySchema = curRoute.value.query.querySchema;
    return JSON.parse(decodeURIComponent(querySchema));
};
