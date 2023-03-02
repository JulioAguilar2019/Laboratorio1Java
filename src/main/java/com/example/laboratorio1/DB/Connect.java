package DB;

import java.sql.Connection;
import java.sql.DriverManager;

public class Connect {
    Connection connection;
    String url = "jdbc:mysql://localhost:3306/laboratorio1";
    String user = "root";
    String password = "";

    public Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            System.out.println(e);
        }
        return connection;
    }

}
