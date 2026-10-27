package com.childtracking.config;

import com.childtracking.model.Report;
import com.childtracking.model.User;
import com.childtracking.repository.ReportRepository;
import com.childtracking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Seeds the database with realistic South African missing children data
 * on first startup if no data exists.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ReportRepository reportRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed if no users exist
        if (userRepository.count() > 0) return;

        // Create admin user
        User admin = new User();
        admin.setFullName("System Administrator");
        admin.setEmail("admin@childtracking.co.za");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole("admin");
        admin.setLocation("Pretoria");
        userRepository.save(admin);

        // Create community user
        User user1 = new User();
        user1.setFullName("Ntwanano Mathebula");
        user1.setEmail("ntwanano@childtracking.co.za");
        user1.setPasswordHash(passwordEncoder.encode("password123"));
        user1.setRole("user");
        user1.setLocation("Soshanguve");
        userRepository.save(user1);

        // Seed realistic missing children reports
        String[][] reportData = {
            {"Lebo Dlamini", "8", "Female", "Short girl, dark complexion, wearing a red and white school uniform, short black hair", "Soshanguve Block H, near Soshanguve High School", "2026-07-15"},
            {"Thabo Nkosi", "12", "Male", "Tall boy, light brown complexion, wearing blue jeans and a white t-shirt, short hair", "Mamelodi East, near the shopping centre", "2026-07-18"},
            {"Zintle Mabaso", "6", "Female", "Small girl, dark skin, wearing a yellow dress, has a birthmark on her left cheek", "Katlehong, near Katlehong Primary School", "2026-07-20"},
            {"Sipho Khumalo", "14", "Male", "Medium height teenager, wearing a grey school tracksuit with orange stripes, shaved head", "Soweto, Dobsonville Extension 3", "2026-07-22"},
            {"Amahle Zulu", "9", "Female", "Young girl, medium complexion, wearing pink top and black leggings, long braided hair", "Durban North, Umgeni Road area", "2026-07-25"},
            {"Kagiso Sithole", "11", "Male", "Boy with a noticeable gap tooth, wearing school clothes — grey pants and white shirt", "Tembisa, near Tembisa Hospital", "2026-07-28"},
            {"Nomvula Dube", "7", "Female", "Small girl wearing a blue and white school dress, has a small scar above her right eyebrow", "Alexandra Township, 10th Avenue", "2026-08-01"},
            {"Rethabile Mokoena", "13", "Female", "Teenage girl, tall for her age, wearing red sneakers and a black hoodie, natural hair", "Bloemfontein, Mangaung area", "2026-08-03"},
            {"Tshepo Molefe", "10", "Male", "Boy wearing a maroon school jersey, glasses, carrying a blue school bag", "Pretoria West, near Pretoria West Station", "2026-08-05"},
            {"Ayanda Ntuli", "5", "Female", "Very young girl, wearing a pink dress with white spots, has a small birthmark on her neck", "Pietermaritzburg, Edendale area", "2026-08-07"},
            {"Bongani Shabalala", "15", "Male", "Tall teenager with dreadlocks, wearing a green tracksuit and white takkies", "Umlazi, V Section", "2026-08-09"},
            {"Precious Mahlangu", "8", "Female", "Girl wearing a traditional beaded necklace, school uniform, short hair with beads", "Bushbuckridge, Justicia Village", "2026-08-11"},
            {"Neo Tladi", "11", "Male", "Boy with a scar on his chin, wearing a yellow and black school uniform", "Polokwane, Seshego Township", "2026-08-13"},
            {"Lerato Mosia", "9", "Female", "Girl with long braids, wearing purple tights and a white top, missing two front teeth", "Kimberley, Galeshewe Township", "2026-08-15"},
            {"Siyanda Cele", "13", "Male", "Teenager wearing a red cap, black t-shirt with white writing, blue shorts", "Cape Town, Khayelitsha Site B", "2026-08-17"}
        };

        for (String[] data : reportData) {
            Report report = new Report();
            report.setChildName(data[0]);
            report.setAge(Integer.parseInt(data[1]));
            report.setGender(data[2]);
            report.setPhysicalDescription(data[3]);
            report.setLastSeenLocation(data[4]);
            report.setDateLastSeen(LocalDate.parse(data[5]));
            report.setStatus("active");
            report.setSubmittedBy(user1);
            reportRepository.save(report);
        }

        System.out.println("✅ Data seeded: 2 users and 15 missing children reports created.");
    }
}
