package military.services;

import military.model.Military;

import java.util.List;

public interface MilitaryService {
    public Military create(Military military);
    public Military get(long id);
    public Military update(Military military);
    public Military delete(long id);
    public List<Military> getAll();
    //public List<Military> search(SearchDTO searchDTO);
}
