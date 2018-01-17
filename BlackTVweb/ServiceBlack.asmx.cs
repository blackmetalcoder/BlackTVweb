using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using Newtonsoft.Json;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Security.Cryptography;
using System.Text;

namespace BlackTVweb
{
    /// <summary>
    /// Summary description for ServiceBlack
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class ServiceBlack : System.Web.Services.WebService
    {
        string sConn = "Data Source=arsenal-135426.mssql.binero.se;database=135426-arsenal;uid=135426_lb11397;pwd=Phantom16540000@";
        //string sConn = "Data Source=DESKTOP-8R91FBS\\SQLEXPRESS;Initial Catalog=135426-arsenal;Persist Security Info=True;User ID=135426_lb11397;Password=Phantom16540000@";

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string Inloggning(string foretag, string losen)
        {
            List<user> U = new List<user>();
            string r = string.Empty;
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spLogginBlack";
                    cmd.Parameters.Add("@foretag", SqlDbType.VarChar, 50).Value = foretag;
                    cmd.Parameters.Add("@losen", SqlDbType.VarChar, 10).Value = losen;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        user u = new user();
                        u.Id = int.Parse(reader["id"].ToString());
                        u.Foretag = reader["Foretag"].ToString().Trim();
                        U.Add(u);
                    }
                    cmd.Connection.Close();
                }
                r = JsonConvert.SerializeObject(U);
                return r;
            }
        }

        [WebMethod]
        public string SkickaEpost(string to, string from, string subject, string text)
        {
            string s = subject.Replace(",", "<br>");
            s += "<br><br>";
            string svar = string.Empty;
            string sBody = s;
            sBody += text.Replace("\n", "<br>");

            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.blacktv.se");

                mail.From = new MailAddress(from);
                mail.To.Add(to);
                mail.Subject = "Intresse finns";
                mail.IsBodyHtml = true;
                mail.Body = sBody;

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("black@blacktv.se", "Olle8910");
                //SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
                svar = "Mail skickat...";
                TillKund(from, sBody);
                return svar;
            }
            catch (Exception ex)
            {
                svar = ex.ToString();
                return svar;
            }

        }
        private void TillKund(string from, string text)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.blacktv.se");

                mail.From = new MailAddress("black@blacktv.se");
                mail.To.Add(from);
                mail.Subject = "Tack, vi kontakar er inom kort";
                mail.IsBodyHtml = true;
                mail.Body = text;

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("black@blacktv.se", "Olle8910");
                //SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);

            }
            catch (Exception ex)
            {
                //fel
            }

        }
        [WebMethod]
        public string HelloUser(string foretag, string losen)
        {
            string svar = "0";
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spLogginBlack";
                    cmd.Parameters.Add("@foretag", SqlDbType.VarChar, 50).Value = foretag;
                    cmd.Parameters.Add("@losen", SqlDbType.VarChar, 10).Value = losen;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        svar = reader["id"].ToString();
                    }
                    cmd.Connection.Close();
                }
            }
            return svar;
        }
        [WebMethod]
        public List<TVrader> getTV(int foretagsid)
        {
            List<TVrader> T = new List<TVrader>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spBlackTVedit";
                    cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = foretagsid;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        TVrader t = new TVrader();
                        t.id = int.Parse(reader["id"].ToString());
                        t.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        t.info = reader["info"].ToString();
                        t.tag = reader["tag"].ToString();
                        t.grupp = int.Parse(reader["grupp"].ToString());
                        t.Video = int.Parse(reader["video"].ToString());
                        T.Add(t);
                    }
                    cmd.Connection.Close();
                }
            }
            return T;
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public object getGrupper(string foretagsid)
        {
            int id = int.Parse(foretagsid);
            List<grupp> G = new List<grupp>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spGetGrupper";
                    cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = id;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        grupp g = new grupp();
                        g.id = int.Parse(reader["id"].ToString());
                        g.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        g.Grupp = reader["Grupp"].ToString().Trim();
                        g.Info = reader["Info"].ToString().Trim();
                        G.Add(g);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(G, Formatting.Indented);
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.DeserializeObject(json);
        }
        [WebMethod]
        public string nyBlackTV(int ForetagsID, string info, int grupp, string tag, int video, string Datum)
        {
            string Svar = string.Empty;
            DateTime d;
            int test = Datum.Length;
            if (test > 0)
            {
                d = DateTime.Parse(Datum);
            }
            else
            {
               d = DateTime.Parse("2020-12-31");
            }
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "SpNyTVrad";
                        cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = ForetagsID;
                        cmd.Parameters.Add("@video", SqlDbType.Int).Value = video;
                        cmd.Parameters.Add("@info", SqlDbType.Text).Value = info;
                        cmd.Parameters.Add("@grupp", SqlDbType.Int).Value = grupp;
                        cmd.Parameters.Add("@tag", SqlDbType.NChar).Value = tag;
                        cmd.Parameters.Add("@slutDatum", SqlDbType.Date).Value = d;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Sparat till databas";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public string UpdateBlackTV(int id, int ForetagsID, string info, int grupp, string tag, int video, string Datum)
        {
            string Svar = string.Empty;
            DateTime d;
            int test = Datum.Length;
            if (test > 0)
            {
                d = DateTime.Parse(Datum);
            }
            else
            {
                d = DateTime.Parse("2020-12-31");
            }
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "spUpdateBlackTV";
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = ForetagsID;
                        cmd.Parameters.Add("@video", SqlDbType.Int).Value = video;
                        cmd.Parameters.Add("@info", SqlDbType.Text).Value = info;
                        cmd.Parameters.Add("@grupp", SqlDbType.Int).Value = grupp;
                        cmd.Parameters.Add("@tag", SqlDbType.NChar).Value = tag;
                        cmd.Parameters.Add("@slutDatum", SqlDbType.Date).Value = d;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Sparat till databas";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public string RaderaBlackTV(int id)
        {
            string Svar = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "spRaderaSidaBLACKTV";
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Raderat";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public string RaderaGrupp(int id)
        {
            string Svar = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "spRaderaBruppBLACKTV";
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Raderat";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public string NyGrupp(int ForetagsID, string info, string Grupp)
        {
            string Svar = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[spNyBlackTvGrupp]";
                        cmd.Parameters.Add("@ForetagsID", SqlDbType.Int).Value = ForetagsID;
                        cmd.Parameters.Add("@Grupp", SqlDbType.NChar).Value = Grupp;
                        cmd.Parameters.Add("@Info", SqlDbType.Text).Value = info;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Sparat till databas";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public string EditGrupp(int id, int ForetagsID, string info, string Grupp)
        {
            string Svar = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[spEditGrupperBlackTV]";
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@ForetagsID", SqlDbType.Int).Value = ForetagsID;
                        cmd.Parameters.Add("@Grupp", SqlDbType.NChar).Value = Grupp;
                        cmd.Parameters.Add("@Info", SqlDbType.Text).Value = info;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Sparat till databas";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string getTVjson(int ftgid, int grupp, DateTime Datum)
        {

            List<TVrader> T = new List<TVrader>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spShowBlackTv";
                    cmd.Parameters.Add("@ftgid", SqlDbType.Int).Value = ftgid;
                    cmd.Parameters.Add("@gruppID", SqlDbType.Int).Value = grupp;
                    //cmd.Parameters.Add("@slutDatum", SqlDbType.Date).Value = Datum;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        TVrader t = new TVrader();
                        t.id = int.Parse(reader["id"].ToString());
                        t.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        t.info = reader["info"].ToString();
                        t.tag = reader["tag"].ToString();
                        t.grupp = int.Parse(reader["grupp"].ToString());
                        T.Add(t);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(T, Formatting.Indented);
            return json;
        }
        [WebMethod]
        public string uppdateraKontakt(int id, string Foretag, string losenord, string Adress, string postnr, string ort,
            string tel, string epost, string kontaktperson)
        {
            string Svar = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "spUpdateKontakt";
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@Foretag", SqlDbType.NChar).Value = Foretag;
                        cmd.Parameters.Add("@losenord", SqlDbType.NChar).Value = losenord;
                        cmd.Parameters.Add("@Adress", SqlDbType.NChar).Value = Adress;
                        cmd.Parameters.Add("@postnr", SqlDbType.NChar).Value = postnr;
                        cmd.Parameters.Add("@ort", SqlDbType.NChar).Value = ort;
                        cmd.Parameters.Add("@tel", SqlDbType.NChar).Value = tel;
                        cmd.Parameters.Add("@epost", SqlDbType.NChar).Value = epost;
                        cmd.Parameters.Add("@kontaktperson", SqlDbType.NChar).Value = kontaktperson;
                        cmd.ExecuteNonQuery();
                        cmd.Connection.Close();
                        Svar = "Sparat till databas";
                    }
                }
            }
            catch (Exception ex)
            {
                return "Något gick fel försök igen !!";
            }

            return Svar;
        }
        [WebMethod]
        public object getKontakt(int id)
        {
            List<kontakt> K = new List<kontakt>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spGetKontakt";
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                       kontakt k = new kontakt();
                        k.Adress = reader["adress"].ToString().Trim();
                        k.Foretag = reader["Foretag"].ToString().Trim();
                        k.epost = reader["epost"].ToString().Trim();
                        k.id = int.Parse(reader["id"].ToString());
                        k.kontaktperson = reader["kontaktperson"].ToString().Trim();
                        k.losenord = reader["losenord"].ToString().Trim();
                        k.ort = reader["ort"].ToString().Trim();
                        k.postnr = reader["postnr"].ToString().Trim();
                        k.tel = reader["tel"].ToString().Trim();
                        K.Add(k);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(K, Formatting.Indented);
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.DeserializeObject(json);
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public object getShowBlackTv(int ftgid, int grupp)
        {
           /* int ftgid = 1;
            int grupp = 1;*/
            List<TVrader> T = new List<TVrader>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spShowBlackTv";
                    cmd.Parameters.Add("@ftgid", SqlDbType.Int).Value = ftgid;
                    cmd.Parameters.Add("@gruppID", SqlDbType.Int).Value = grupp;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        TVrader t = new TVrader();
                        t.id = int.Parse(reader["id"].ToString());
                        t.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        t.info = reader["info"].ToString();
                        t.tag = reader["tag"].ToString();
                        t.grupp = int.Parse(reader["grupp"].ToString());
                        T.Add(t);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(T, Formatting.Indented);
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.DeserializeObject(json);
        }
        [WebMethod]
        public string loggaIn(string user, string password)
        {
            string svar = "0";
            /*Decrypt amvändare och lösen ord för sökning i databas*/
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {
                var keybytes = Encoding.UTF8.GetBytes("7061737323313233");
                var iv = Encoding.UTF8.GetBytes("7061737323313233");

                //DECRYP TUser
                var encryptedUser = Convert.FromBase64String(user);
                var decriptedFromUser = DecryptStringFromBytes(encryptedUser, keybytes, iv);
                string sUser = decriptedFromUser.ToString();
                //DECRYP Password
                var encryptedPassword = Convert.FromBase64String(password);
                var decriptedFromPassword = DecryptStringFromBytes(encryptedPassword, keybytes, iv);
                string sPassword = decriptedFromPassword.ToString();
                using (SqlConnection con = new SqlConnection(sConn))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Connection.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "spLogginBlack";
                        cmd.Parameters.Add("@foretag", SqlDbType.VarChar, 50).Value = sUser;
                        cmd.Parameters.Add("@losen", SqlDbType.VarChar, 10).Value = sPassword;
                        SqlDataReader reader = cmd.ExecuteReader();
                        while (reader.Read())
                        {
                            svar = reader["id"].ToString();
                        }
                        cmd.Connection.Close();
                    }
                }
            }
            /*Slut decrypt                                         */
            return svar;
        }
        private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.
                var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (var msDecrypt = new MemoryStream(cipherText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string getGrupper10(int foretagsid)
        {
            List<grupp> G = new List<grupp>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spGetGrupper";
                    cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = foretagsid;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        grupp g = new grupp();
                        g.id = int.Parse(reader["id"].ToString());
                        g.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        g.Grupp = reader["Grupp"].ToString().Trim();
                        g.Info = reader["Info"].ToString().Trim();
                        G.Add(g);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(G, Formatting.Indented);
            return json;
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public object getShowBlackTvWEB(string ftgid)
        {
           int id = int.Parse(ftgid);
            List<TVrader> T = new List<TVrader>();
            using (SqlConnection con = new SqlConnection(sConn))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.Connection.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "spBlackTVedit";
                    cmd.Parameters.Add("@foretagsid", SqlDbType.Int).Value = id;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        TVrader t = new TVrader();
                        t.id = int.Parse(reader["id"].ToString());
                        t.ForetagsID = int.Parse(reader["ForetagsID"].ToString());
                        t.info = reader["info"].ToString().Trim();
                        t.tag = reader["tag"].ToString().Trim();
                        t.grupp = int.Parse(reader["Gruppid"].ToString());
                        t.Gruppnamn = reader["Grupp"].ToString().Trim();
                        string text1 = reader["Video"].ToString();
                        int num1;
                        bool res = int.TryParse(text1, out num1);
                        if (res == false)
                        {
                            // String is not a number.
                        }

                        t.Video = num1;
                        //Slut datum
                        int i = reader["Datum"].ToString().Length;
                        if (i > 0)
                        {
                            t.Datum = reader["Datum"].ToString().Substring(0,10);
                        }
                        else
                        {
                            t.Datum = reader["Datum"].ToString();
                        }
                        

                        T.Add(t);
                    }
                    cmd.Connection.Close();
                }
            }
            string json = JsonConvert.SerializeObject(T, Formatting.Indented);
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.DeserializeObject(json);
        }
    }
}
