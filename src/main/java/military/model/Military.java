package military.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "MILITARY_RECRUIT")
public class Military {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @Column(name = "FIRSTNAME")
    private String firstName;

    @Column(name = "LASTNAME")
    private String lastName;

    @Column(name = "BIRTHDATE")
    private Date birthDate;

    @Column(name = "HOMEADDRESS")
    private String homeAddress;

    @Column(name = "DOCUENTNUMBER")
    private String documentNumber;

    @Column(name = "DOCUMENTTYPE")
    private String documentType;

    @Column(name = "DOCUMENTCREATE")
    private Date documentCreate;

    @Column(name = "DOCUMENTEXPIRED")
    private Date documentExpired;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public Date getDocumentCreate() {
        return documentCreate;
    }

    public void setDocumentCreate(Date documentCreate) {
        this.documentCreate = documentCreate;
    }

    public Date getDocumentExpired() {
        return documentExpired;
    }

    public void setDocumentExpired(Date documentExpired) {
        this.documentExpired = documentExpired;
    }

    @Override
    public String toString() {
        return "Military{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", birthDate=" + birthDate +
                ", homeAddress='" + homeAddress + '\'' +
                ", documentNumber='" + documentNumber + '\'' +
                ", documentType='" + documentType + '\'' +
                ", documentCreate=" + documentCreate +
                ", documentExpired=" + documentExpired +
                '}';
    }
}
