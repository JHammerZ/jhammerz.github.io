FROM tomcat:10.1-jdk17-temurin

# Overwrite the default Tomcat server.xml with your custom configuration file
COPY server.xml /usr/local/tomcat/conf/server.xml

# Optional: Copy your compiled Java web application (WAR file) into Tomcat
# COPY target/my-app.war /usr/local/tomcat/webapps/

EXPOSE 8080
CMD ["catalina.sh", "run"]
