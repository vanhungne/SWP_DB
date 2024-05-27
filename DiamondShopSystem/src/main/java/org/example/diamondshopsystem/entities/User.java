package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "[user]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;

    @Column(name = "user_name")
    private String name;

    @Column(name = "user_password")
    private String password;

    @Column(name = "user_phone_number")
    private String phoneNumber;

    @Column(name = "user_email")
    private String email;

    @Column(name = "user_address")
    private String address;

    @Column(name = "user_accumulated_points")
    private int accumulatedPoints;

    @Column(name = "[role]")
    private String role;

    @Column(name = "[status]")
    private boolean status;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.DETACH, CascadeType.PERSIST,})
    private List<Promotions> promotions;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Order> customers;

    @OneToMany(mappedBy = "sale", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Order> Sales;

    @OneToMany(mappedBy = "delivery", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Order> Delivery;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<FeedBack> users;

    public <E> User(String email, String password, ArrayList<E> es) {
    }
}
