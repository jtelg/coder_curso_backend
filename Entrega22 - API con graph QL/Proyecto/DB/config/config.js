import dotenv from "../../src/utils/dotenvUtils.js";

const config = {
  mongodb: {
    cnxStr: process.env.MONGODB_CNXSTR,
  },
  firebase: {
    type: "service_account",
    project_id: "custer-agency",
    private_key_id: process.env.FIREBASE_KEYID,
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtNsaAir535CXI\n+4oQ05zxDffd+cs4pR/Do8TmGUQLAhj3RxiXC9+apA6GahQjZZd+B9dRALR0Z7b7\nQxtQQ4MpiPBqxokEjY/Psbq4+8t0wxNlZqi7jwXct3k8X0r8oCg9k/63e5gDiIzM\nfhQ1vpIqIUG8rDVNJTSBk0i01cQoH+pIJ4CtL6G1fs2BXWeQnQIu/RzxGp6W2cMH\ni3LbGL0dUrBJb52nNY1vuQ8//ZURC+4qfj0Y57HXUg3S1ZKRLTiBrAIr2B0/nZZy\nyobqdaGb52TFuFZGMu0VpssbtBdFi+pBggGlm7bil0mMbY4eO357KA8e6w1wjdtj\nh/IGmODHAgMBAAECggEAA2zh4AjeW2CXnrHauRp2MA4mqK0X57bcOfIzIpm9Trpr\n4/fz9Ii3k0dLQj02yLxpkoR1LZTl/KdQZwecsqmjHl8m4fWrH/vsrB7HooDYNSbm\na0rsa0kYxJScQSVhRj2kjhMvJlG7X9aDckfL/oQWP98IfcKqCyyBLU7MUUco6eIv\nV/DJ5rg+Vfkg1B/p5tm2NZ1OYFnE/0BB4476/Mu3iG1mIIFaxzlHaZAdch8onSEP\n5LVacaXEBIUr74d5GO22gYX05pe7VvdIp5Evztp2GDgRewMyh4OCzPXRLSzm+bve\nForW9LYNznnt3zItikEdPRLstSI5clabzzodBiisgQKBgQDflgwkJF6Vta8mvg5C\nfxed4fecRMjSLvsAaO1HSK7sgZbFWJ0+FzZfHFVhoE5TWg+E7jRXj8rTEoNY3Gii\neDFkZ9qmdzeed2d3xIxzAEP0hBSS2m0EgDj8o2I4G5Mc8cCPaJ5qZdT1PPqkYSA9\njl0fXZ7/eBAXNu3uOR1EziSSFQKBgQDGU0QVhTuBSjBIfaG1HXMCdWnZoTqeYILh\neIUsaACp3SFWz70udelTsLegijtbu2VLprWFVoDjDtgZK3sJTV3qYAwjf5BPocRq\nwmwHQ9HiSsEaAH5fdcVVfTUjyseqAQ9XNfC6GnDs/7z4szGD1apS1M/SArh6EIcC\nIuz/Vu8KawKBgQDMt3Aqb3qDDTVv/bjEveV70/iJhplxiT6dI3WOPUicmBLaYsam\noU5RS3oJx2OwAdgP2KLoQWpuVJca98R+bhqbWlPi82ljmOSNztLiQS33ZjAIPiJv\nao/DEj3OLcFHUTsEk7/on5CbctfzRlLkycMOAwSf2OiyuMKlynm4FB97+QKBgCgy\nSjNebKAYzE51ACh4To4qBAkzD3F4OC7AwaUtcyz6f75bnoljJqZqw90LB1rhUXeS\n02myDa93m78GPAq3nphZXTx4p2QscmX8/+49BbYq1paRkQuCEDvyg6m8eNlxG43e\nhesCXu76Km/xydBhpwLg1TpIiOFcpjB9qbFbCln/AoGANafklF1ILisobY4EyAgp\ncOxPEFW70+KC+L4ULVDWHzPmTpiupitcKVk6burWbGDxf9WRwXktz3062r+/9QJz\n9mw2d56VWIBDs5c7JfPOYrHs8mQ1yjdHg73cKpPu1jRoPhLBMIIyNeWy54u8tO7w\nEvMrh925O3likTNZXI2oBkU=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-7ps7z@custer-agency.iam.gserviceaccount.com",
    client_id: process.env.FIREBASE_CLIENTID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7ps7z%40custer-agency.iam.gserviceaccount.com",
  },
}
export default config;