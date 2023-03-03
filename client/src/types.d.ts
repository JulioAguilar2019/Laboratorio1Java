declare type ClientList = ClientDetail[]

declare interface ClientDetail {
    id: number
    nombre: string
    direccion: string
    telefono: string
    email: string
}

declare type NewClientForm = Required<ClientDetail>

declare type OrdersList = OrderDetails[]

declare interface OrderDetails {
    id: number
    idCliente: number
    fecha: string
    total: number
    estado: string
}

declare type NewOrderPost = Required<OrderDetails>