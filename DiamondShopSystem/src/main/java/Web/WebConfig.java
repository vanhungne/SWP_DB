package Web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // Thay đổi thành nguồn gốc được phép
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Chỉ cho phép các phương thức HTTP cần thiết
                        .allowCredentials(true); // Cho phép gửi cookie qua lại giữa client và server
            }
        };
    }
}