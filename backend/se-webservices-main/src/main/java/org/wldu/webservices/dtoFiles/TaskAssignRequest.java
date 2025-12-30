package org.wldu.webservices.dtoFiles;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskAssignRequest {
    private Long taskId;
    private Long userId;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
