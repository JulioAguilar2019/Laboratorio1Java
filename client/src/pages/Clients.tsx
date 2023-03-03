import {useQuery, useMutation} from "@tanstack/react-query";
import {
    Box,
    Button,
    FormControl, FormErrorMessage,
    FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
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
import {useForm, SubmitHandler} from 'react-hook-form'
import axios from 'axios'
import {useEffect, useState} from "react";

export const Clients = () => {

    const {isOpen, onOpen, onClose} = useDisclosure()
    const [method, setMethod] = useState<string>('')


    const {isLoading, data, refetch} = useQuery({
        queryKey: ['clients-data'],
        queryFn: async (): Promise<ClientList | null> => {
            const response = await fetch('http://localhost:8080/Laboratorio1_war_exploded/Cliente')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }
    })

    const postNewClient = useMutation({
        mutationFn: (data: NewClientForm) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Cliente?action=post", data, {})
        }
    })


    const putClient = useMutation({
        mutationFn: (data: NewOrderPost) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Cliente?action=edit", data, {})
        }
    })

    const deleteClient = useMutation({
        mutationFn: (id: number) => {
            return axios.post("http://localhost:8080/Laboratorio1_war_exploded/Cliente?action=delete", {
                id
            }, {})
        }
    })

    const {register, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<NewClientForm>();

    const onSubmit: SubmitHandler<NewClientForm> = async (data) => {
        if (method == 'add') {
            postNewClient.mutate(data)
        } else {
            putClient.mutate(data)
        }

        onClose()
    }


    useEffect(() => {
        refetch().then(() => console.log('xddd'))
    }, [postNewClient.isSuccess, deleteClient.isSuccess])


    if (isLoading) {
        return (<>
            <Spinner/>
        </>)
    }

    return (
        <Box m={'6'}>
            <Button onClick={() => {
                setMethod('add')
                onOpen()
            }
            } m={4}>Add Client</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        <ModalHeader>Add a new client</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>

                            <FormControl>
                                <FormLabel htmlFor={'Nombre'}>Nombre</FormLabel>
                                <Input
                                    id={'nombre'}
                                    placeholder={'Nombre'}
                                    {
                                        ...register('nombre', {
                                            required: 'Required',
                                            minLength: {value: 2, message: 'Min 4 length'}
                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.nombre && errors.nombre.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'direccion'}>Dirección</FormLabel>
                                <Input
                                    id={'direccion'}
                                    placeholder={'Dirección'}
                                    {
                                        ...register('direccion', {
                                            required: 'Required',
                                            minLength: {value: 6, message: 'Min 4 length'}
                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.nombre && errors.nombre.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'telefono'}>Telefono</FormLabel>
                                <Input
                                    id={'telefono'}
                                    placeholder={'Telefono'}
                                    {
                                        ...register('telefono', {
                                            required: 'Required',
                                            minLength: {value: 6, message: 'Min 4 length'}
                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.nombre && errors.nombre.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor={'email'}>Email</FormLabel>
                                <Input
                                    id={'email'}
                                    type={'email'}
                                    placeholder={'Email'}
                                    {
                                        ...register('email', {
                                            required: 'Required',
                                            minLength: {value: 6, message: 'Min 4 length'}
                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.nombre && errors.nombre.message}
                                </FormErrorMessage>
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
                            <Th isNumeric={true}>ID</Th>
                            <Th>Name</Th>
                            <Th>Direction</Th>
                            <Th isNumeric={true}>Cellphone Number</Th>
                            <Th>Email</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            data?.map((data, index) => (
                                <Tr key={index}>
                                    <Td isNumeric={true}>{data.id}</Td>
                                    <Td>{data.nombre}</Td>
                                    <Td>{data.direccion}</Td>
                                    <Td isNumeric={true}>{data.telefono}</Td>
                                    <Td>{data.email}</Td>
                                    <Td>
                                        <Button colorScheme={'red'} onClick={() => {
                                            deleteClient.mutate(data.id)
                                        }
                                        }>Delete
                                        </Button>
                                        <Button mx={'2'} onClick={() => {
                                            setMethod('update')
                                            setValue('id', data.id)
                                            setValue('nombre', data.nombre)
                                            setValue('email', data.email)
                                            setValue('telefono', data.telefono)
                                            setValue('direccion', data.direccion)
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