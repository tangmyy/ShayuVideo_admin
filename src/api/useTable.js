import service from "@/utils/service.js";

export const getReqresList = (e) => {
    return service({
        method: "GET",
        url: `https://reqres.in/api/users?page=${e.page}&per_page=${e.pageSize}`,
    });
};