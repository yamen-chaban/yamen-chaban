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

## Lokaler Testnachweis (24.11.2026)

Die auf GitHub gespeicherten Dateien wurden auf einem Windows-PC mit Node.js v24.22.3 durch den Assistenten ausgeführt. Ergebnis: 10 Tests, 10 erfolgreich, 0 fehlgeschlagen. Getestete Vorlagen-/Testdateien: Stand Commit `89c811a1b19ad22b97a1a7b8ef8d72f92254272a`.

| Prüfung | Ergebnis |
|---|---|
| NSG-Zuordnung und Abhängigkeit | PASS |
| Adressbereiche und Subnetze | PASS |
| Prioritäten | PASS |
| Management → App: TCP 443 | Allow |
| Management → App: TCP 22 | Deny |
| Management → App: TCP 3389 | Deny |
| Anderes Subnetz → App: TCP 443 | Deny |
| Externe Beispieladresse → App: TCP 443 | Deny |
| Management → App: UDP 443 | Deny |
| Keine VM- oder Public-IP-Ressourcen | PASS |

Dies ist ein durch den Assistenten ausgeführter Offline-Test des Lernprototyps, kein Nachweis einer eigenen Azure-Praxisausführung oder einer Azure-seitigen Vorlagenvalidierung.

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
