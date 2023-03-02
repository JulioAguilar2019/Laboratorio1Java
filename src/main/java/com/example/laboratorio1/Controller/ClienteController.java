package com.example.laboratorio1.Controller;

import Model.Cliente;
import com.example.laboratorio1.ModelDAO.ClienteDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "ClienteController", value = "/Cliente")
public class ClienteController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        DB.Connect cn = new DB.Connect();

        ClienteDAO dao = new ClienteDAO(cn.getConnection());

        try {
            String json = new Gson().toJson(dao.listar());
            response.setContentType("application/json");

            PrintWriter out = response.getWriter();
            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        System.out.println(action);

        try {
            switch (action) {
                case "edit":
                    editClient(request, response);
                    break;
                case "post":
                    saveClient(request, response);
                    break;
                case "put":
                    updateClient(request, response);
                    break;
                case "delete":
                    deleteClient(request, response);
                    break;
            }


        } catch (Exception e) {
            System.out.println(e);
        }
    }

    private void deleteClient(HttpServletRequest request, HttpServletResponse response) {
    }

    private void updateClient(HttpServletRequest request, HttpServletResponse response) {
    }

    private void saveClient(HttpServletRequest request, HttpServletResponse response) throws IOException {
        DB.Connect cn = new DB.Connect();
        ClienteDAO dao = new ClienteDAO(cn.getConnection());

        JsonObject data = new Gson().fromJson(request.getReader(), JsonObject.class);
        String nombre = data.get("nombre").getAsString();
        String direccion = data.get("direccion").getAsString();
        String telefono = data.get("telefono").getAsString();
        String email = data.get("email").getAsString();

        PrintWriter out = response.getWriter();
        response.addHeader("Access-Control-Allow-Origin", "*");
        Map jsonRespo = new HashMap<>();
        String json = "";

        try {
            dao.insertar( new Cliente(nombre, direccion, telefono, email) );
            jsonRespo.put("message", "Cliente registrado");
            jsonRespo.put("status", "200");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            jsonRespo.put("message", "Error al registrar cliente");
            jsonRespo.put("status", "500");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        }


    }

    private void editClient(HttpServletRequest request, HttpServletResponse response) {
    }
}
