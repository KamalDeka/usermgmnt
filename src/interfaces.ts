export interface Name {
	first: string,
	last: string
}

export interface Friend {
	id: number,
	name: string
}

export interface CustomerData {
	isActive: boolean,
	_id: string,
    index: number,
    guid: string,
    balance: string,
    picture: string,
    age: number,
	eyeColor: string,
	name: Name,
	company: string,
    email: string,
    phone: string,
    address: string,
    about: string,
    registered: string,
    latitude: string,
	longitude: string,
	tags: Array<string>,
	range: Array<number>,
	friends: Array<Friend>,
    greeting: string,
    favoriteFruit: string
}

export interface queryParams {
    [x:string]: string
}

export interface Action {
    type: Symbol,
    data?: any,
    customerId?: string,
    pageIndex?: number,
    pageSize?: number
};

export interface CityState {
    City: string,
    State: string
}
