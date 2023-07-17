public class AMPContactWrapper {
 
    public Boolean checked{ get; set; }
    public Contact cont{ get; set; }
 
    public AMPContactWrapper() {
        cont = new Contact();
        checked = false;
    }
 
    public AMPContactWrapper(Contact c) {
        cont = c;
        checked = false;
    }
}