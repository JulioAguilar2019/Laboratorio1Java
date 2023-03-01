package com.example.laboratorio1.Controller;

import com.example.laboratorio1.ModelDAO.ClienteDAO;
import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "ClienteController", value = "/ClienteController")
public class ClienteController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        DB.Connect cn = new DB.Connect();

        ClienteDAO dao = new ClienteDAO(cn.getConnection());

        try {
            request.setAttribute("clientes", dao.listar());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

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

    }
}
