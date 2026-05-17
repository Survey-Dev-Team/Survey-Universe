export interface UpdateUserDataPayload {
    base64encodedImage: string,
    firstName: string,
    lastName: string
}

export interface UpdateUserData {
    imageUrl: string,
    firstName: string,
    lastName: string,
    role: 'ADMIN'| 'CUSTOMER'| 'WAITER', 
    email: string,
    locationId?: string,
    locationAddress?: string
}

export interface UpdateUserDataFormResponse {
    message: string;
}