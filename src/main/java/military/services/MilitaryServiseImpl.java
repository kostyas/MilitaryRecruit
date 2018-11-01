package military.services;

import military.model.Military;
import military.repository.MilitaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MilitaryServiseImpl implements MilitaryService{

    @Autowired
    private MilitaryRepository militaryRepository;

    @Override
    public Military create(Military military) {
        return militaryRepository.save(military);
    }

    @Override
    public Military get(long id) {
        return militaryRepository.getOne((int) id);
    }

    @Override
    public Military update(Military military) {
        Military militaryUpdate = get(military.getId());
        if(militaryUpdate!=null){
            militaryUpdate.setFirstName(military.getFirstName());
            militaryUpdate.setLastName(military.getLastName());
            militaryUpdate.setBirthDate(military.getBirthDate());
            militaryUpdate.setHomeAddress(military.getHomeAddress());
            militaryUpdate.setDocumentNumber(military.getDocumentNumber());
            militaryUpdate.setDocumentType(military.getDocumentType());
            militaryUpdate.setDocumentCreate(military.getDocumentCreate());
            militaryUpdate.setDocumentExpired(military.getDocumentExpired());
            return militaryRepository.save(military);
        }
        return null;
    }

    @Override
    public Military delete(long id) {
        Military militaryDelete = get(id);
        if (militaryDelete !=null){
            militaryRepository.delete(id);
            return militaryDelete;
        }
        return null;
    }

    @Override
    public List<Military> getAll() {
        return militaryRepository.findAll();
    }
}
