package org.wldu.webservices.dtoFiles;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {

    private Long id;
    private String message;
    private boolean seen;
    private LocalDateTime createdAt;
}
