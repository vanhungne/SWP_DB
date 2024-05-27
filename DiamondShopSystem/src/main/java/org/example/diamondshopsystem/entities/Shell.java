package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "shell")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Shell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shell_id")
    private int shellId;

    @Column(name = "shell_name")
    private String shellName;

    @Column(name = "shell_price")
    private double shellPrice;

    @Column(name = "shell_material")
    private String shellMaterial;

    @Column(name = "shell_design")
    private String shellDesign;

    @Column(name = "shell_weight")
    private double shellWeight;

    @OneToMany(
            mappedBy = "shell", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    private List<Products> shells;
}
