package com.example.laboratorio1.Controller;

import com.example.laboratorio1.Model.Cliente;
import com.example.laboratorio1.DB.Connect;
import com.example.laboratorio1.Model.Pedido;
import com.example.laboratorio1.ModelDAO.PedidoDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.math.BigDecimal;


@WebServlet(name = "PedidoController", value = "/Pedido")
public class PedidoController extends HttpServlet {

    Connect cn = new Connect();
    PedidoDAO dao = new PedidoDAO(cn.getConnection());
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");

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

        try {
            switch (action) {
                case "edit":
                    editPedido(request, response);
                    break;
                case "post":
                    savePedido(request, response);
                    break;
                case "put":
                    showPedido(request, response);
                    break;
                case "delete":
                    deletePedido(request, response);
                    break;
            }


        } catch (Exception e) {
            System.out.println(e);
        }
    }

    private void deletePedido(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObject data = new Gson().fromJson(request.getReader(), JsonObject.class);
        int id = data.get("id").getAsInt();

        PrintWriter out = response.getWriter();
        response.addHeader("Access-Control-Allow-Origin", "*");
        Map jsonRespo = new HashMap<>();
        String json = "";

        try {
            dao.eliminar(id);
            jsonRespo.put("message", "Pedido eliminado");
            jsonRespo.put("status", "200");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            jsonRespo.put("message", "Error al eliminar el pedido");
            jsonRespo.put("status", "500");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        }
    }

    private void showPedido(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObject data = new Gson().fromJson(request.getReader(), JsonObject.class);
        int id = data.get("id").getAsInt();

        PrintWriter out = response.getWriter();
        response.addHeader("Access-Control-Allow-Origin", "*");
        Map jsonRespo = new HashMap<>();
        String json = "";

        try {
            Pedido pedido = dao.buscarPorId(id);
            String nombreCliente = dao.obtenerNombreClientePorId(pedido.getIdCliente());

            jsonRespo.put("message", "Pedido encontrado");
            jsonRespo.put("status", "200");
            jsonRespo.put("data", pedido);
            jsonRespo.put("clientName", nombreCliente);
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            jsonRespo.put("message", "Error al buscar el pedido");
            jsonRespo.put("status", "400");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        }
    }

    private void savePedido(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {

        JsonObject data = new Gson().fromJson(request.getReader(), JsonObject.class);
        String idCliente = data.get("idCliente").getAsString();
        String fecha = data.get("fecha").getAsString();
        String total = data.get("total").getAsString();
        String estado = data.get("estado").getAsString();

        int idClienteParsed = Integer.parseInt(idCliente);
        SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd");
        Date fechaParsed = formato.parse(fecha);
        BigDecimal totalParsed = new BigDecimal(total);

        PrintWriter out = response.getWriter();
        response.addHeader("Access-Control-Allow-Origin", "*");
        Map jsonRespo = new HashMap<>();
        String json = "";

        try {
            dao.insertar( new Pedido(idClienteParsed, fechaParsed,totalParsed, estado) );
            jsonRespo.put("message", "Pedido registrado");
            jsonRespo.put("status", "200");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            jsonRespo.put("message", "Error al registrar Pedido");
            jsonRespo.put("status", "500");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        }


    }

    private void editPedido(HttpServletRequest request, HttpServletResponse response) throws SQLException, ParseException, IOException {
        JsonObject data = new Gson().fromJson(request.getReader(), JsonObject.class);

        int id = data.get("id").getAsInt();
        String idCliente = data.get("idCliente").getAsString();
        String fecha = data.get("fecha").getAsString();
        String total = data.get("total").getAsString();
        String estado = data.get("estado").getAsString();

        int idClienteParsed = Integer.parseInt(idCliente);
        SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd");
        Date fechaParsed = formato.parse(fecha);
        BigDecimal totalParsed = new BigDecimal(total);

        PrintWriter out = response.getWriter();
        response.addHeader("Access-Control-Allow-Origin", "*");
        Map jsonRespo = new HashMap<>();
        String json = "";

        Pedido pedido = dao.buscarPorId(id);

        pedido.setIdCliente(idClienteParsed);
        pedido.setFecha(fechaParsed);
        pedido.setTotal(totalParsed);
        pedido.setEstado(estado);

        try {
            dao.actualizar( pedido );
            jsonRespo.put("message", "Pedido actualizado");
            jsonRespo.put("status", "200");
            jsonRespo.put("data", pedido);
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            jsonRespo.put("message", "Error al actualizar el pedido");
            jsonRespo.put("status", "500");
            json = new Gson().toJson( jsonRespo );

            out.print(json);
            out.flush();
        }
    }
}
