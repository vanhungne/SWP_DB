package org.example.diamondshopsystem.payload;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResponseData {
    private int status=200;
    private boolean success=true;
    private String description;
    private Object data;
}
