import axios from "axios";
import { useNavigate } from "react-router-dom";

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000
});

// 1. 요청 인터셉터: Authorization 헤더에 토큰 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken"); // localStorage에서 토큰 가져오기
        if(token){
            config.headers['Authorization'] = token; // 헤더에 토큰 추가
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. 응답 인터셉터: 401 응답 시 토큰 갱신
apiClient.interceptors.response.use(
    (response) => {
        return response; // 응답이 성공적이면 그대로 반환
    },
    async (error) => {
        const originalRequest = error.config;

        if((error.response?.status === 401 || error.response?.status === 40103) && !originalRequest._retry){
            originalRequest._retry = true; // 무한루프 방지

            const navigate = useNavigate();

            try {
                const refreshToken = localStorage.getItem("jwtToken"); 
                const res = await axios.post("http://localhost:8080/auth/reissue", {
                    refreshToken
                });

                const newToken = res.headers.authorization; // 새로운 jwt토큰
                localStorage.setItem("jwtToken", newToken); // 새로운 jwt토큰 저장

                // 기존 요청 재실행
                originalRequest.headers['Authorization'] = newToken;
                
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                navigate("/"); // 로그인 폼으로 이동
            }
        }

        return Promise.reject(error);

    }

);

export default apiClient;