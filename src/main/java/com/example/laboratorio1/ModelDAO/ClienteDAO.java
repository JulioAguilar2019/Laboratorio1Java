package ModelDAO;

import DB.Connect;

import java.sql.Connection;

public class ClienteDAO {
    Connect cn = new Connect();
    Connection conn;

    public void getClientes() {
        String sql = "SELECT * FROM Clientes";
        conn = cn.getConnection();
    }

}

