export interface GalaxyMovie {
  id: string;
  name: string;
  age: string;
  duration: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  imageLandscape: string;
  imagePortrait: string;
  slug: string;
  trailer: string;
  rate: number;
  totalVotes: number;
  views: number;
  order: number;
}

export interface GalaxyCinema {
  id: string;
  code: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  phone: string;
  cityId: string;
  imageLandscape: string;
  imagePortrait: string;
  imageUrls: string[];
  order: number;
}

export interface GalaxySession {
  id: string;
  showDate: string;
  showTime: string;
  screenName: string;
  totalSeat: number;
  bookedSeat: number;
  caption: "voice" | "sub" | string;
  version: "2d" | "3d" | "imax" | string;
  movieFormat: string;
  movie: GalaxyMovie;
  cinema: GalaxyCinema;
}

export interface GalaxyApiResponse {
  response: {
    status: number;
    code: number;
    message: string;
    url: string;
  };
  data: {
    total: number;
    result: GalaxySession[];
  };
}

export const CITY_MAP: Record<string, { name: string; region: string }> = {
  "599535ea-1ea2-4393-9b5a-3ba3a807f363": { name: "TP. Hồ Chí Minh", region: "Miền Nam" },
  "f4bf5f53-4e80-40c8-b1e0-f11ffa9a636a": { name: "Hà Nội", region: "Miền Bắc" },
  "48def6c3-5254-4ece-b63c-e5524fda1296": { name: "Đà Nẵng", region: "Miền Trung" },
  "3504c4df-cc0f-4356-a934-260cf5e9ca32": { name: "Bến Tre", region: "Miền Tây" },
  "477b975e-caac-4149-8fcc-a10fbde8df84": { name: "Cà Mau", region: "Miền Tây" },
};

/**
 * Raw initial data provided from Galaxy Cinema API response
 */
export const rawGalaxyApiResponse: GalaxyApiResponse = {
  response: {
    status: 200,
    code: 0,
    message: "OK",
    url: "https://www.galaxycine.vn/api/v2/mobile/sessions2?includeCinema=true&includeMovie=true"
  },
  data: {
    total: 3359,
    result: [
      {
        id: "0000001005-307021",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 4-NIGELLA",
        totalSeat: 140,
        bookedSeat: 32,
        caption: "voice",
        version: "2d",
        movieFormat: "2D Lồng Tiếng",
        movie: {
          id: "a0cd6a78-f461-4264-9e7d-ee220b3bde9d",
          name: "Quyết Cua Anh Này",
          age: "13",
          duration: 115,
          startDate: "2026-10-01 00:00:00",
          endDate: "2026-11-27 00:00:00",
          createdAt: "2026-09-24 15:03:16",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/24/henrys-first-date-1_1790237320350.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/24/henrys-first-date-4_1790237311455.jpg",
          slug: "henrys-first-date",
          trailer: "https://www.youtube.com/watch?v=NSrioJtAiEU",
          rate: 8.6,
          totalVotes: 20,
          views: 1420,
          order: 0
        },
        cinema: {
          id: "13ca0671-3301-4341-ab39-15893aec02f6",
          code: "0000001005",
          name: "Galaxy CineO Coop Quang Trung",
          latitude: "10.835079",
          longitude: "106.662213",
          address: "Tầng 3,TTTM Co.opmart Quang Trung - 304A Quang Trung, Phường Thông Tây Hội, TP.HCM",
          phone: "1900 2224",
          cityId: "599535ea-1ea2-4393-9b5a-3ba3a807f363",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/4/14/750-galaxy-quang-trung_1776163996754.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/4/14/500-galaxy-quang-trung_1776163992499.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-1_1776164015124.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-4_1776164019703.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-2_1776164026715.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-3_1776164034361.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-5_1776164038637.jpg"
          ],
          order: 5
        }
      },
      {
        id: "0000001005-307022",
        showDate: "2026-10-05",
        showTime: "18:15",
        screenName: "RAP 4-NIGELLA",
        totalSeat: 140,
        bookedSeat: 58,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "a0cd6a78-f461-4264-9e7d-ee220b3bde9d",
          name: "Quyết Cua Anh Này",
          age: "13",
          duration: 115,
          startDate: "2026-10-01 00:00:00",
          endDate: "2026-11-27 00:00:00",
          createdAt: "2026-09-24 15:03:16",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/24/henrys-first-date-1_1790237320350.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/24/henrys-first-date-4_1790237311455.jpg",
          slug: "henrys-first-date",
          trailer: "https://www.youtube.com/watch?v=NSrioJtAiEU",
          rate: 8.6,
          totalVotes: 20,
          views: 1420,
          order: 0
        },
        cinema: {
          id: "13ca0671-3301-4341-ab39-15893aec02f6",
          code: "0000001005",
          name: "Galaxy CineO Coop Quang Trung",
          latitude: "10.835079",
          longitude: "106.662213",
          address: "Tầng 3,TTTM Co.opmart Quang Trung - 304A Quang Trung, Phường Thông Tây Hội, TP.HCM",
          phone: "1900 2224",
          cityId: "599535ea-1ea2-4393-9b5a-3ba3a807f363",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/4/14/750-galaxy-quang-trung_1776163996754.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/4/14/500-galaxy-quang-trung_1776163992499.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-1_1776164015124.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-4_1776164019703.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/14/galaxy-quang-trung-2_1776164026715.jpg"
          ],
          order: 5
        }
      },
      {
        id: "1001-260210",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 1",
        totalSeat: 160,
        bookedSeat: 45,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "fb233b0f-edb4-4eb1-ade8-7f8b83ab2457",
          code: "1001",
          name: "Galaxy Cinema Nguyễn Du",
          latitude: "10.773390",
          longitude: "106.693290",
          address: "116 Nguyễn Du, Phường Bến Thành, TP.HCM",
          phone: "1900 2224",
          cityId: "599535ea-1ea2-4393-9b5a-3ba3a807f363",
          imageLandscape: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-3_1698051874807.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051870157.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051240852.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-4_1698051246666.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/10/galaxy-nd-1_1775813386195.jpg",
            "https://cdn.galaxycine.vn/media/2026/4/10/galaxy-nd-2_1775813391316.jpg"
          ],
          order: 15
        }
      },
      {
        id: "1001-260211",
        showDate: "2026-10-05",
        showTime: "19:00",
        screenName: "RAP 2",
        totalSeat: 180,
        bookedSeat: 82,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "fb233b0f-edb4-4eb1-ade8-7f8b83ab2457",
          code: "1001",
          name: "Galaxy Cinema Nguyễn Du",
          latitude: "10.773390",
          longitude: "106.693290",
          address: "116 Nguyễn Du, Phường Bến Thành, TP.HCM",
          phone: "1900 2224",
          cityId: "599535ea-1ea2-4393-9b5a-3ba3a807f363",
          imageLandscape: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-3_1698051874807.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051870157.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051240852.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-4_1698051246666.jpg"
          ],
          order: 15
        }
      },
      {
        id: "1004-378548",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 3",
        totalSeat: 150,
        bookedSeat: 60,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "fe18db21-cdee-44ba-90c3-f2e3ac6c8320",
          code: "1004",
          name: "Galaxy Cinema Kinh Dương Vương",
          latitude: "10.750501",
          longitude: "106.628085",
          address: "718 Bis Kinh Dương Vương, Phường Phú Lâm, TP.HCM",
          phone: "1900 2224",
          cityId: "599535ea-1ea2-4393-9b5a-3ba3a807f363",
          imageLandscape: "https://cdn.galaxycine.vn/media/2023/11/22/1800_1700640830550.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/11/22/1200_1700640800802.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2025/4/16/kdv-4_1744775318378.jpg",
            "https://cdn.galaxycine.vn/media/2025/4/16/kdv-1_1744775323718.jpg",
            "https://cdn.galaxycine.vn/media/2025/4/16/kdv-3_1744775328968.jpg",
            "https://cdn.galaxycine.vn/media/2025/4/16/kdv-2_1744775334249.jpg"
          ],
          order: 11
        }
      },
      {
        id: "1006-195662",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 2",
        totalSeat: 130,
        bookedSeat: 22,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "0f95ca57-3707-4e69-bf01-c15993afd3ea",
          code: "1006",
          name: "Galaxy Cinema Sense City Bến Tre",
          latitude: "10.241373258400458",
          longitude: "106.37806884298485",
          address: "Tầng 1, TTTM Sense City Bến Tre - Số 26A Trần Quốc Tuấn, Phường An Hội, Tỉnh Vĩnh Long",
          phone: "1900 2224",
          cityId: "3504c4df-cc0f-4356-a934-260cf5e9ca32",
          imageLandscape: "https://cdn.galaxycine.vn/media/4/./4_12.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-3_1698053831044.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-1_1698053844082.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-2_1698053849001.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-4_1698053853519.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-5_1698053857288.jpg"
          ],
          order: 99
        }
      },
      {
        id: "1007-245646",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 6",
        totalSeat: 155,
        bookedSeat: 40,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "5e0c771c-55b2-431c-a368-b8bd1d815e3d",
          code: "1007",
          name: "Galaxy Cinema Mipec Long Biên",
          latitude: "21.045536",
          longitude: "105.865776",
          address: "Tầng 6, Mipec Riverside Long Biên - Số 02 Long Biên, Phường Bồ Đề, Hà Nội",
          phone: "1900 2224",
          cityId: "f4bf5f53-4e80-40c8-b1e0-f11ffa9a636a",
          imageLandscape: "https://cdn.galaxycine.vn/media/2023/11/22/1800_1700639234996.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/11/22/1200_1700639230326.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/31/galaxy-mipec-long-bien-1_1698745465411.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/31/galaxy-mipec-long-bien-4_1698745470938.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/31/galaxy-mipec-long-bien-2_1698745476496.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/31/galaxy-mipec-long-bien-3_1698745488907.jpg"
          ],
          order: 99
        }
      },
      {
        id: "1008-234231",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 7",
        totalSeat: 140,
        bookedSeat: 35,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "3a9fe5b5-0f63-4889-aaae-6c1b76d7050d",
          code: "1008",
          name: "Galaxy Cinema Coop Đà Nẵng",
          latitude: "16.066673",
          longitude: "108.186528",
          address: "Tầng 3, TTTM Co.opmart Đà Nẵng - 478 Điện Biên Phủ, Phường Thanh Khê, TP. Đà Nẵng",
          phone: "1900 2224",
          cityId: "48def6c3-5254-4ece-b63c-e5524fda1296",
          imageLandscape: "https://cdn.galaxycine.vn/media/1/./1_172.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-da-nang_1698052408891.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-da-nang-1_1698052206857.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-da-nang-3_1698052210667.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-da-nang-4_1698052214666.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-da-nang-5_1698052220835.jpg"
          ],
          order: 99
        }
      },
      {
        id: "1010-162626",
        showDate: "2026-10-05",
        showTime: "15:30",
        screenName: "RAP 5",
        totalSeat: 120,
        bookedSeat: 18,
        caption: "sub",
        version: "2d",
        movieFormat: "2D Phụ Đề",
        movie: {
          id: "1e403224-98da-4a69-9d21-f6d034ee90e1",
          name: "Trại Buôn Người",
          age: "18",
          duration: 135,
          startDate: "2026-09-24 00:00:00",
          endDate: "2026-11-29 00:00:00",
          createdAt: "2026-09-15 14:53:54",
          imageLandscape: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-750_1790067333205.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2026/9/22/trai-buon-nguoi-500_1790067332155.jpg",
          slug: "trai-buon-nguoi",
          trailer: "https://www.youtube.com/watch?v=NzOUpcA3fSg",
          rate: 9.3,
          totalVotes: 379,
          views: 4520,
          order: 0
        },
        cinema: {
          id: "0a7ad4dd-1a39-46d7-9ec1-aaaf1d17cb55",
          code: "1010",
          name: "Galaxy Cinema Sense City Cà Mau",
          latitude: "9.178496573694481",
          longitude: "105.15176863347739",
          address: "Tầng 2, TTTM Co.opmart Cà Mau - Số 09 Trần Hưng Đạo, Phường Tân Thành, Tỉnh Cà Mau",
          phone: "1900 2224",
          cityId: "477b975e-caac-4149-8fcc-a10fbde8df84",
          imageLandscape: "https://cdn.galaxycine.vn/media/3/./3_250.jpg",
          imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ca-mau_1698051664047.jpg",
          imageUrls: [
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ca-mau-1_1698051537159.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ca-mau-2_1698051541015.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ca-mau-3_1698051544914.jpg",
            "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ca-mau-4_1698051549441.jpg"
          ],
          order: 99
        }
      }
    ]
  }
};

/**
 * Generate extended dates & time slots so users can explore showtimes for 7 full days
 */
export function buildFullGalaxySessions(): GalaxySession[] {
  const baseSessions = rawGalaxyApiResponse.data.result;
  const extraTimes = ["09:45", "11:30", "13:45", "16:20", "17:45", "19:30", "20:45", "22:15"];
  const formats: { format: string; version: string; caption: string }[] = [
    { format: "2D Phụ Đề", version: "2d", caption: "sub" },
    { format: "2D Lồng Tiếng", version: "2d", caption: "voice" },
    { format: "3D Phụ Đề", version: "3d", caption: "sub" },
  ];

  const fullList: GalaxySession[] = [...baseSessions];

  // Generate sessions for the next 6 days as well
  for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().slice(0, 10);

    // For dayOffset > 0, generate showtimes for each cinema & movie
    if (dayOffset > 0) {
      baseSessions.forEach((base, idx) => {
        extraTimes.slice(0, 4).forEach((time, tIdx) => {
          const fmt = formats[(idx + tIdx + dayOffset) % formats.length];
          const screenNum = ((idx + tIdx) % 6) + 1;
          fullList.push({
            id: `${base.cinema.code}-${base.movie.id.slice(0, 4)}-${dateStr.replace(/-/g, "")}-${time.replace(":", "")}`,
            showDate: dateStr,
            showTime: time,
            screenName: `RAP ${screenNum}${screenNum === 4 ? "-NIGELLA" : ""}`,
            totalSeat: 140,
            bookedSeat: Math.floor(Math.random() * 90),
            caption: fmt.caption,
            version: fmt.version,
            movieFormat: fmt.format,
            movie: base.movie,
            cinema: base.cinema,
          });
        });
      });
    } else {
      // Add extra slots for today (day 0) as well
      baseSessions.forEach((base, idx) => {
        extraTimes.slice(3, 7).forEach((time, tIdx) => {
          if (time === base.showTime) return;
          const fmt = formats[(idx + tIdx) % formats.length];
          const screenNum = ((idx + tIdx) % 6) + 1;
          fullList.push({
            id: `${base.cinema.code}-${base.movie.id.slice(0, 4)}-${dateStr.replace(/-/g, "")}-${time.replace(":", "")}`,
            showDate: dateStr,
            showTime: time,
            screenName: `RAP ${screenNum}${screenNum === 4 ? "-NIGELLA" : ""}`,
            totalSeat: 140,
            bookedSeat: Math.floor(Math.random() * 90),
            caption: fmt.caption,
            version: fmt.version,
            movieFormat: fmt.format,
            movie: base.movie,
            cinema: base.cinema,
          });
        });
      });
    }
  }

  return fullList;
}

/**
 * Fetch Galaxy Cinema Sessions API with fallback
 */
export async function fetchGalaxySessions(): Promise<GalaxyApiResponse> {
  const endpoint = "https://www.galaxycine.vn/api/v2/mobile/sessions2?includeCinema=true&includeMovie=true";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(endpoint, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
      },
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.result && Array.isArray(data.data.result) && data.data.result.length > 0) {
        return data as GalaxyApiResponse;
      }
    }
  } catch {
    // Graceful fallback to rich local dataset with provided response format
  }

  const result = buildFullGalaxySessions();
  return {
    response: {
      status: 200,
      code: 0,
      message: "OK (Local Mock/Cache)",
      url: endpoint,
    },
    data: {
      total: 3359,
      result,
    },
  };
}

/**
 * Extract distinct cities from sessions
 */
export function getDistinctCities(sessions: GalaxySession[]) {
  const map = new Map<string, { cityId: string; name: string; region: string; count: number }>();
  sessions.forEach((s) => {
    const cityId = s.cinema.cityId;
    const info = CITY_MAP[cityId] || { name: s.cinema.address.split(",").pop()?.trim() || "Khác", region: "Toàn quốc" };
    if (!map.has(cityId)) {
      map.set(cityId, { cityId, name: info.name, region: info.region, count: 0 });
    }
    map.get(cityId)!.count++;
  });
  return Array.from(map.values());
}

/**
 * Extract distinct cinemas from sessions
 */
export function getDistinctCinemas(sessions: GalaxySession[]) {
  const map = new Map<string, GalaxyCinema>();
  sessions.forEach((s) => {
    if (!map.has(s.cinema.id)) {
      map.set(s.cinema.id, s.cinema);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/**
 * Extract distinct movies from sessions
 */
export function getDistinctMovies(sessions: GalaxySession[]) {
  const map = new Map<string, GalaxyMovie>();
  sessions.forEach((s) => {
    if (!map.has(s.movie.id)) {
      map.set(s.movie.id, s.movie);
    }
  });
  return Array.from(map.values());
}

/**
 * Helper to get embedded YouTube URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}
