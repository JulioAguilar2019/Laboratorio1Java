import {useMutation, useQuery} from "@tanstack/react-query";
import axios from 'axios'
import {
    Box, FormControl, FormErrorMessage, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select,
    Spinner
} from "@chakra-ui/react";
import {
    Button,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";

export const Orders = () => {

    const {isOpen, onOpen, onClose} = useDisclosure()
    const [method, setMethod] = useState<string>('')

    const postNewOrder = useMutation({
        mutationFn: (data: NewOrderPost) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Pedido?action=post", data, {})
        }
    })

    const putOrder = useMutation({
        mutationFn: (data: NewOrderPost) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Pedido?action=edit", data, {})
        }
    })


    const loadOne = useMutation({
        mutationFn: (id: number) => {
            return axios.post('http://localhost:8080/Laboratorio1_war_exploded/Pedido?action=put', {
                id
            })
        }
    })

    const deleteOrder = useMutation({
        mutationFn: (id: number) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Pedido?action=delete", {
                id
            }, {})
        }
    })

    const clienteData = useQuery({
        queryKey: ['clients-data'],
        queryFn: async (): Promise<ClientList | null> => {
            const response = await fetch('http://localhost:8080/Laboratorio1_war_exploded/Cliente')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }
    })

    const {data, isLoading, status} = useQuery({
        queryKey: ['orders-data'],
        queryFn: async (): Promise<OrdersList | null> => {
            const response = await fetch('http://localhost:8080/Laboratorio1_war_exploded/Pedido')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }
    })

    const {register, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<NewOrderPost>();

    const onSubmit: SubmitHandler<NewOrderPost> = async (data) => {
        if (method == 'add') {
            postNewOrder.mutate(data)
        } else {
            putOrder.mutate(data)
        }
        onClose()
    }


    if (isLoading) {
        return (<><Spinner/></>)
    }


    return (
        <Box>
            <Button onClick={() => {
                onOpen()
                setMethod('add')
            }
            } m={4}>Add New Order</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        <ModalHeader>Add a new client</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>

                            <FormControl>
                                <FormLabel htmlFor={''}>ID Cliente</FormLabel>

                                <Select placeholder='Select a client'  {
                                    ...register('idCliente', {
                                        required: 'Required',
                                    })
                                }>
                                    {
                                        clienteData.data?.map((data, index) => (
                                            <option key={index} value={data.id}>ID: {data.id} | {data.nombre} </option>
                                        ))
                                    }
                                </Select>
                                <FormErrorMessage>
                                    {errors.estado && errors.estado.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'estado'}>Estado</FormLabel>
                                <Select placeholder='Select option'  {
                                    ...register('estado', {
                                        required: 'Required',
                                    })
                                }>
                                    <option value='Pendiente'>Pendiente</option>
                                    <option value='Entregado'>Entregado</option>
                                    <option value='Cancelado'>Cancelado</option>
                                    <option value='Activo'>Activo</option>
                                    <option value='Inactivo'>Inactivo</option>
                                </Select>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'total'}>Total</FormLabel>
                                <Input
                                    id={'total'}
                                    placeholder={'total'}
                                    type={'number'}
                                    {
                                        ...register('total', {
                                            required: 'Required',
                                        })
                                    }
                                />

                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'fecha'}>Fecha</FormLabel>
                                <Input
                                    id={'fecha'}
                                    type={'date'}
                                    placeholder={'ID Cliente'}
                                    {
                                        ...register('fecha', {
                                            required: 'Required',
                                        })
                                    }
                                />
                            </FormControl>

                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} isLoading={isSubmitting} type='submit'>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
            <TableContainer>
                <Table variant={'striped'}>
                    <TableCaption>All users registered at {new Date().toDateString()}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th isNumeric={true}>Pedido ID</Th>
                            <Th isNumeric={true}>Cliente ID</Th>
                            <Th>Estado</Th>
                            <Th>Fecha</Th>
                            <Th isNumeric={true}>Total</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            data?.map((data, index) => (
                                <Tr key={index}>
                                    <Td isNumeric={true}>{data.id}</Td>
                                    <Td isNumeric={true}>{data.idCliente}</Td>
                                    <Td>{data.estado}</Td>
                                    <Td>{data.fecha}</Td>
                                    <Td isNumeric={true}>${data.total}</Td>
                                    <Td>
                                        <Button colorScheme={'red'} onClick={() => {
                                            deleteOrder.mutate(data.id)
                                        }
                                        }>Delete
                                        </Button>
                                        <Button mx={'2'} onClick={() => {
                                            setMethod('update')
                                            setValue('id', data.id)
                                            setValue('estado', data.estado)
                                            setValue('idCliente', data.idCliente)
                                            setValue('fecha', data.fecha)
                                            setValue('total', data.total)
                                            onOpen()
                                        }
                                        }>Edit</Button>
                                    </Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}