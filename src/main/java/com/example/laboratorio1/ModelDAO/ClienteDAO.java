package com.example.laboratorio1.ModelDAO;

import DB.Connect;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import Model.Cliente;

public class ClienteDAO {
    Connect cn = new Connect();
    Connection conn;

    public ClienteDAO(Connection con) {
        this.conn = con;
    }

    public List<Cliente> listar() throws SQLException {
        List<Cliente> clientes = new ArrayList<>();
        String sql = "SELECT id, nombre, direccion, telefono, email FROM clientes";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nombre = rs.getString("nombre");
                    String direccion = rs.getString("direccion");
                    String telefono = rs.getString("telefono");
                    String email = rs.getString("email");
                    Cliente c = new Cliente(id, nombre, direccion, telefono, email);
                    clientes.add(c);
                }
            }
        }
        return clientes;
    }


    public void getClientes() {
        String sql = "SELECT * FROM Clientes";
        conn = cn.getConnection();
    }

}

