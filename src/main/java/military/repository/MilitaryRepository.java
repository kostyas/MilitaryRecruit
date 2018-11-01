package military.repository;

import military.model.Military;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public class MilitaryRepository implements JpaRepository<Military, Integer> {
    @Override
    public List<Military> findAll() {
        return null;
    }

    @Override
    public List<Military> findAll(Sort sort) {
        return null;
    }

    @Override
    public Page<Military> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public List<Military> findAllById(Iterable<Integer> iterable) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(Integer integer) {

    }

    @Override
    public void delete(Military military) {

    }

    @Override
    public void deleteAll(Iterable<? extends Military> iterable) {

    }

    @Override
    public void deleteAll() {

    }

    @Override
    public <S extends Military> S save(S s) {
        return null;
    }

    @Override
    public <S extends Military> List<S> saveAll(Iterable<S> iterable) {
        return null;
    }

    @Override
    public Optional<Military> findById(Integer integer) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(Integer integer) {
        return false;
    }

    @Override
    public void flush() {

    }

    @Override
    public <S extends Military> S saveAndFlush(S s) {
        return null;
    }

    @Override
    public void deleteInBatch(Iterable<Military> iterable) {

    }

    @Override
    public void deleteAllInBatch() {

    }

    @Override
    public Military getOne(Integer integer) {
        return null;
    }

    @Override
    public <S extends Military> Optional<S> findOne(Example<S> example) {
        return Optional.empty();
    }

    @Override
    public <S extends Military> List<S> findAll(Example<S> example) {
        return null;
    }

    @Override
    public <S extends Military> List<S> findAll(Example<S> example, Sort sort) {
        return null;
    }

    @Override
    public <S extends Military> Page<S> findAll(Example<S> example, Pageable pageable) {
        return null;
    }

    @Override
    public <S extends Military> long count(Example<S> example) {
        return 0;
    }

    @Override
    public <S extends Military> boolean exists(Example<S> example) {
        return false;
    }

    public void delete(long id) {
    }
}
