import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f9fafb",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  header: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: 16,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#00000033",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 12,
    lineHeight: 1.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: "bold",
    width: 80,
    color: "#0f172a",
  },
  infoText: {
    color: "#475569",
    fontSize: 12,
    flex: 1,
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 6,
    marginBottom: 12,
  },
});

const PdfRender = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Crime Tracker</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.description}>{report.details}</Text>

        {report.image && <Image src={report.image.url} style={styles.image} />}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoText}>{report.street}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoText}>
            {new Date(report.date).toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PdfRender;
