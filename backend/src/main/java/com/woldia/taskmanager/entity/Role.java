// backend/src/main/java/com/woldia/taskmanager/entity/Role.java
package com.woldia.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleName name;

    private String description;

    public enum RoleName {
        ROLE_ADMIN,
        ROLE_MANAGER,
        ROLE_USER
    }
}