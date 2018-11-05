package military.controller;


import military.model.Military;
import military.services.MilitaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/military")
public class MilitaryController {

    @Autowired
    private MilitaryService militaryService;

    @RequestMapping(value = "create/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Military createMilitary(@RequestBody Military military){
        return militaryService.create(military);
    }


    @RequestMapping(value = "edit/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Military editMilitary(@PathVariable int id, @RequestBody Military military){
        return militaryService.update(military);
    }


    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Military deleteMilitary(@PathVariable int id){
        return militaryService.delete(id);
    }

    @RequestMapping(value = "", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Military> allMilitary(){
        return militaryService.getAll();
    }
}
