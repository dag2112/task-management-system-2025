package org.wldu.webservices.dtoFiles;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.wldu.webservices.enities.TaskStatus;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String assignedToUsername;
    private String categoryName;
    private LocalDate dueDate;
}
