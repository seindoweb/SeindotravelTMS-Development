export interface PriceSearchRoomReq {
    RoomNo: string;
    NoOfAdults: string;
    NoOfChild: string;
    Child1Age: string;
    Child2Age: string;
    ExtraBed: boolean;
}

export interface PriceSearchFilterReq {
    minPrice?: string;
    maxPrice?: string;
    minRating?: number;
    areas?: string[];
    facilities?: string[];
    mealPlans?: string[];
}

export interface PriceSearchDestinationReq {
    country: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    rooms: PriceSearchRoomReq[];
    filter?: PriceSearchFilterReq;
    page: number;
}

export interface HotelPriceInfo {
    ntaPrice: number;
    ntaPricePerNight: string;
    sellingPrice: number;
    sellingPricePerNight: string;
    roomName: string;
    mealPlanName: string;
}

export interface HotelFacility {
    name: string;
    type: string;
}

export interface HotelImage {
    url: string;
    source: string;
}

export interface HotelSearchResultItem {
    key: string;
    name: string;
    hotelCode: string;
    code: string;
    rating: string;
    currency: string;
    thumbnail: string;
    thumbnailSource: string;
    minPrices: HotelPriceInfo;
    maxPrices: HotelPriceInfo;
    geoLocations: {
        latitude: string;
        longitude: string;
    };
    locations: {
        addressMain: string;
        addressAlternative: string;
        zipCode: string;
        area: string;
        landmark: string;
        cityName: string;
        cityCode: string;
        countryName: string;
        countryCode: string;
        countryNameNative: string;
        region: string;
        subRegion: string;
    };
    facilities: HotelFacility[];
    images: HotelImage[];
}

export interface PriceSearchFiltersResponse {
    ratings: number[];
    areas: string[];
    facilities: string[];
    mealPlans: string[];
}

export interface PriceSearchPaginationLabel {
    label: string;
    active: boolean;
}

export interface PriceSearchDestinationData {
    filters: PriceSearchFiltersResponse;
    params: Record<string, unknown>;
    results: HotelSearchResultItem[];
    page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_next: boolean;
    has_prev: boolean;
    labels: PriceSearchPaginationLabel[];
}

export interface PriceSearchDestinationResponse {
    meta: {
        message: string;
        code: number;
        status: string;
    };
    data: PriceSearchDestinationData;
}

export interface PriceSearchHotelReq {
    country: string;
    destination: string;
    hotel: string;
    checkIn: string;
    checkOut: string;
    rooms: PriceSearchRoomReq[];
}

export interface HotelRoomCancellationPolicy {
    type?: string;
    fromDate: string;
    toDate: string;
    value?: string;
    percent?: string | number;
}

export interface HotelRoomPhoto {
    url: string;
    isMain: boolean;
}

export interface HotelRoomMoreInformations {
    roomCode: string;
    roomName: string;
    roomSize: string;
    maxOccupancy: number;
    maxAdults: number;
    maxChildren: number;
    isSmokingAllowed: boolean;
    roomDescription: {
        content: string;
        cDataContent?: { '#cdata-section': string }[];
    };
    amenities: {
        amenityGroupName: string;
        amenitiesTypeList: string[] | null;
    };
    photo: {
        image: HotelRoomPhoto[];
    } | null;
}

export interface HotelRoomInformations {
    thumbnail: string;
    thumbnailSource: string;
    moreInformations: HotelRoomMoreInformations;
}

export interface RoomOccupancy {
    child1Age: string;
    child2Age: string;
    extraBed: boolean;
    noOfAdults: string;
    noOfChild: string;
    rateKey: string;
    roomNo: string;
}

export interface HotelRoomDetail {
    key: string;
    code?: string;
    roomCode: string;
    name: string;
    mealPlanCode: string;
    mealPlanName: string;
    cancellationPolicyType?: string;
    packageRate?: boolean;
    currency?: string;
    ntaPrice: number;
    ntaPricePerNight: string;
    sellingPrice: number;
    sellingPricePerNight: string;
    markupPrice: number;
    markupPricePerNight: number;
    maxOccupancy: number;
    extraBedAllowed: boolean;
    cancellationPolicies: HotelRoomCancellationPolicy[];
    refundable: boolean;
    specialRequest: string;
    remarks: string;
    message?: string | null;
    roomInformations?: HotelRoomInformations;
    roomOccupancies?: RoomOccupancy[] | RoomOccupancy;
}

export interface HotelDetailInfo {
    sessionID?: string;
    hotelCode: string;
    name: string;
    destinationCode: string;
    countryCode: string;
    currency: string;
    rating: string;
    thumbnail: string;
    locations: {
        addressMain: string;
        addressAlternative: string;
        zipCode: string;
        area: string;
        landmark: string;
        cityName: string;
        cityCode: string;
        countryName: string;
        countryCode: string;
    };
    facilities: HotelFacility[];
    roomDetails: HotelRoomDetail[];
    images?: HotelImage[];
}

export interface PriceSearchHotelData {
    params: Record<string, unknown>;
    results: HotelDetailInfo;
}

export interface PriceSearchHotelResponse {
    meta: {
        message: string;
        code: number;
        status: string;
    };
    data: PriceSearchHotelData;
}

export interface PrebookRoomReq {
    country: string;
    destination: string;
    hotel: string;
    checkIn: string;
    checkOut: string;
    sessionId: string;
    roomDetails: {
        code: string;
        mealPlan: string;
        cancellationPolicyType: string;
        packageRate: boolean;
    };
}

export interface GuestPageProps {
    country?: string;
    destination?: string;
    hotel?: string;
    checkIn?: string;
    checkOut?: string;
    code?: string;
    mealPlan?: string;
    cancellationPolicyType?: string;
    packageRate?: string;
    sessionId?: string;
}

export interface PrebookRoomParam {
    roomNo: string;
    noOfAdults: string;
    noOfChild: string;
    child1Age?: string;
    child2Age?: string;
    extraBed?: boolean;
    rateKey: string;
}

export interface PrebookRoomData {
    params?: {
        country: string;
        destination: string;
        hotel: string;
        sessionId?: string;
        checkIn: string;
        checkOut: string;
        rooms: PrebookRoomParam[];
    };
    rooms?: {
        code: string;
        mealPlan: string;
        cancellationPolicyType: string;
        packageRate: boolean;
    };
    results?: {
        key: string;
        sessionID: string;
        name: string;
        hotelCode: string;
        code: string;
        rating: string;
        currency: string;
        thumbnail: string;
        thumbnailSource?: string;
        geoLocations?: { latitude: string; longitude: string };
        locations?: {
            addressMain: string;
            addressAlternative?: string;
            zipCode?: string;
            area?: string;
            landmark?: string;
            cityName?: string;
            cityCode?: string;
            countryName?: string;
            countryCode?: string;
        };
        roomDetails?: HotelRoomDetail[] | null;
        images?: Array<{ url: string; source?: string }>;
        facilities?: Array<{ name: string; type: string }>;
    };
    selectedRoom?: HotelRoomDetail;
    hotelInfo?: any;
}

export interface RoomGuestProps {
    adults: number;
    children: number;
    childAges: number[];
    extraBed: boolean;
}
