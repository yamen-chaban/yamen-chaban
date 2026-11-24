# Azure Network Security Lab – Lernentwurf

**Status:** KI-unterstützter Lernprototyp zur eigenen Übung. Keine persönliche praktische Azure-Ausführung, kein produktives Deployment und keine Herstellerzertifizierung nachgewiesen. Keine Azure-Ressourcen wurden erstellt.

## Ziel
Ein isoliertes Beispieldesign für eine Azure-VNet-Struktur mit Management- und Anwendungssubnetz. Nur TCP 443 aus dem Managementsubnetz soll am Anwendungssubnetz eingehend erlaubt sein. Alle übrigen eingehenden Verbindungen werden durch eine benutzerdefinierte Deny-Regel blockiert.

```text
VNet 10.42.0.0/16
  ├─ Management 10.42.1.0/24
  │    └── TCP 443 ──► Application 10.42.2.0/24
  └─ Application subnet: NSG (Allow 100, Deny 200)
```

## Dateien
- [main.json](main.json): ARM-Vorlage mit VNet, Subnetzen und NSG.
- [network.test.cjs](network.test.cjs): lokale Node.js-Tests gegen die tatsächlichen Vorlagenregeln.

## Offline testen
Node.js 18 oder neuer, keine Anmeldung, keine Pakete, kein Cloudzugriff:
```sh
node --test network.test.cjs
```

Die Tests prüfen Struktur, Adressbereiche, Prioritäten und ausgewählte eingehende IPv4-Flüsse. Sie bilden **nicht** die vollständige Azure-NSG-Auswertung (z. B. zustandsbehaftete Flows, NIC-NSGs, Service Tags, Routing, Outbound oder Security Admin Rules) nach. Keine öffentliche IP und keine VM enthalten. Kein tatsächlicher Netzwerkverkehr.

## Nächste eigene Übungen
1. Vorlage und Regeln nachvollziehen; eigene Testfälle ergänzen.
2. Mit ausdrücklicher Freigabe in einer eigenen Testumgebung ARM-Validierung und What-if ausführen. Diese Offline-Tests ersetzen keine Azure-Validierung.
3. Erst nach Kosten- und Berechtigungsprüfung eine reale Testumgebung planen. Ergebnisse und eigene Änderungen dokumentieren.
4. Erst danach als selbst durchgeführte Azure-Fallstudie ins Bewerbungsportfolio übernehmen.

## Quellen
- [Microsoft Learn: Network security groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Microsoft Learn: NSG filtering](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-group-how-it-works)
- [ARM VNet 2024-05-01](https://learn.microsoft.com/en-us/azure/templates/microsoft.network/2024-05-01/virtualnetworks)
- [ARM NSG 2024-01-01](https://learn.microsoft.com/en-us/azure/templates/microsoft.network/2024-01-01/networksecuritygroups)
