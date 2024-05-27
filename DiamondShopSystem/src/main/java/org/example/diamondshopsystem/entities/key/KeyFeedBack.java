package org.example.diamondshopsystem.entities.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data

public class KeyFeedBack implements Serializable {

    @Column(name = "userid")
    private int userId;

    @Column(name = "orderid")
    private int orderId;

}
