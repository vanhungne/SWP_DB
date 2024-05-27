package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "diamonds")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter


public class Diamond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diamond_id")
    private int diamondId;

    @Column(name = "carat")
    private double carat;

    @Column(name = "price")
    private double price;

    @Column(name = "cut")
    private String cut;

    @Column(name = "color")
    private String color;

    @Column(name = "clarity")
    private String clarity;

    @Column(name = "certificate")
    private String certification;

    @OneToMany(
            mappedBy = "diamond", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    private List<Products> diamonds;
}
