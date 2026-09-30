import * as catalyst from 'zcatalyst-sdk-node';
import { CaseMaster, OSINTFeed, AICaseSummary, DigitalAsset } from './models';

/**
 * Database Helper Class for Karnataka Police Crime Analytics Platform.
 * Seamlessly integrates Zoho Catalyst Data Store in Production.
 */
export class DatabaseHelper {
  public app: any;

  constructor(context?: any) {
    this.app = context ? (catalyst as any).initialize(context) : (catalyst as any).initialize();
    console.log('DatabaseHelper initialized using Zoho Catalyst SDK.');
  }

  /**
   * Helper to execute raw ZCQL queries.
   */
  async executeQuery<T>(queryStr: string): Promise<T[]> {
    try {
      const queryService = this.app.zcql();
      const queryResponse = await queryService.executeZCQLQuery(queryStr);
      
      return queryResponse.map((row: any) => {
        const keys = Object.keys(row);
        if (keys.length === 1) {
          return row[keys[0]] as T;
        }
        
        const flattened: any = {};
        for (const key of keys) {
          Object.assign(flattened, row[key]);
        }
        return flattened as T;
      });
    } catch (error) {
      console.error('Error executing ZCQL query:', error);
      throw error;
    }
  }

  /**
   * Fetch a single Case by ID
   */
  async getCaseById(caseMasterId: number): Promise<CaseMaster | null> {
    const query = `SELECT * FROM CaseMaster WHERE CaseMasterID = ${caseMasterId}`;
    const results = await this.executeQuery<CaseMaster>(query);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Insert a new case record into CaseMaster table
   */
  async createCase(caseData: Partial<CaseMaster>): Promise<any> {
    try {
      const table = this.app.datastore().table('CaseMaster');
      const response = await table.insertRow({ ...caseData });
      return response;
    } catch (error) {
      console.error('Error inserting CaseMaster record in Catalyst:', error);
      throw error;
    }
  }

  /**
   * Retrieve OSINT feeds for a case or general search
   */
  async getOSINTFeeds(associatedCaseId?: number): Promise<OSINTFeed[]> {
    try {
      let query = `SELECT * FROM osint_feed`;
      if (associatedCaseId) {
        query += ` WHERE associated_case_id = ${associatedCaseId}`;
      }
      return await this.executeQuery<OSINTFeed>(query);
    } catch (error) {
      console.error('Error fetching OSINT feeds:', error);
      throw error;
    }
  }

  /**
   * Save or Update AI Case Summary in database
   */
  async saveAICaseSummary(summary: AICaseSummary): Promise<void> {
    try {
      const table = this.app.datastore().table('ai_case_summaries');
      const payload = {
        summary_id: summary.summary_id,
        case_master_id: summary.case_master_id,
        summary_text: summary.summary_text,
        timeline_events: JSON.stringify(summary.timeline_events || []),
        identified_modus_operandi: summary.identified_modus_operandi || '',
        key_suspects: JSON.stringify(summary.key_suspects || []),
        risk_factors: JSON.stringify(summary.risk_factors || []),
        hotspot_ref: JSON.stringify(summary.hotspot_ref || {}),
        patrol_recommendations: summary.patrol_recommendations || '',
        updated_at: new Date().toISOString()
      };
      await table.insertRow(payload);
    } catch (error) {
      console.error('Error saving AI case summary in Catalyst:', error);
      throw error;
    }
  }

  /**
   * Retrieve Digital Asset Metadata by Owner
   */
  async getDigitalAssetsByOwner(ownerId: string, ownerType: string): Promise<DigitalAsset[]> {
    try {
      const query = `SELECT * FROM digital_assets WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}'`;
      return await this.executeQuery<DigitalAsset>(query);
    } catch (error) {
      console.error('Error retrieving digital assets:', error);
      throw error;
    }
  }

  /**
   * Zoho NoSQL Helper Wrapper: Get Document
   */
  async getDocument(tableName: string, rowId: string | number): Promise<any> {
    try {
      const table = this.app.datastore().table(tableName);
      const row = await table.getRow(rowId);
      return row;
    } catch (error) {
      console.error(`Error retrieving document ${rowId} from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Zoho NoSQL Helper Wrapper: Insert Document
   */
  async insertDocument(tableName: string, document: any): Promise<any> {
    try {
      const table = this.app.datastore().table(tableName);
      const response = await table.insertRow(document);
      return response;
    } catch (error) {
      console.error(`Error inserting document into ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Zoho NoSQL Helper Wrapper: Update Document
   */
  async updateDocument(tableName: string, document: any): Promise<any> {
    try {
      const table = this.app.datastore().table(tableName);
      const response = await table.updateRow(document);
      return response;
    } catch (error) {
      console.error(`Error updating document in ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Zoho NoSQL Helper Wrapper: Delete Document
   */
  async deleteDocument(tableName: string, rowId: string | number): Promise<any> {
    try {
      const table = this.app.datastore().table(tableName);
      const response = await table.deleteRow(rowId);
      return response;
    } catch (error) {
      console.error(`Error deleting document ${rowId} from ${tableName}:`, error);
      throw error;
    }
  }
}
