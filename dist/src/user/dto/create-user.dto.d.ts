export declare class AddressDto {
    street: string;
    building: string;
    apartment: string;
    district: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    landmark: string;
    direction_url: string;
    latitude: number;
    longitude: number;
}
export declare class UpdateUserDto {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar_url: string;
    address: AddressDto;
}
