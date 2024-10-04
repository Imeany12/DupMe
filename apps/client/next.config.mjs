/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns:[
            {
                protocol:'https',
                hostname: 'avatars.githubusercontent.com',
                port: "",
                pathname:'/u/**',
            }
            //เดี๋ยวมาเพิ่มให้หลายๆ auth
        ]
    }
};

export default nextConfig;
