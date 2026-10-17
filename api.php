<?php
/* Cris Pop Arte — API do painel. Grava data.json e recebe uploads.
   ⚠️ TROQUE A SENHA ABAIXO antes de publicar. */
$SENHA = '@cris456';

session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$DIR = __DIR__; $FILE = "$DIR/data.json"; $UP = "$DIR/imagens/uploads"; $BK = "$DIR/backups";
$a = $_GET['action'] ?? '';
$in = json_decode(file_get_contents('php://input'), true) ?: [];
function out($d, $c = 200) { http_response_code($c); echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }
$auth = !empty($_SESSION['ok']);

if ($a === 'ping')   out(['ok' => true, 'auth' => $auth, 'senhaPadrao' => $SENHA === 'trocar123']);
if ($a === 'login') {
  if (hash_equals($SENHA, (string)($in['senha'] ?? ''))) { session_regenerate_id(true); $_SESSION['ok'] = 1; out(['ok' => true]); }
  sleep(1); out(['ok' => false, 'erro' => 'Senha incorreta'], 401);
}
if ($a === 'logout') { session_destroy(); out(['ok' => true]); }
if (!$auth) out(['ok' => false, 'erro' => 'Faça login'], 401);

if ($a === 'load') out(is_file($FILE) ? json_decode(file_get_contents($FILE), true) : new stdClass);

if ($a === 'save') {
  if (!isset($in['data']) || !is_array($in['data'])) out(['ok' => false, 'erro' => 'Dados inválidos'], 400);
  if (is_file($FILE)) {                       // backup automático (guarda os 15 últimos)
    @mkdir($BK, 0755, true); @copy($FILE, "$BK/data-" . date('Y-m-d_His') . '.json');
    $old = glob("$BK/data-*.json"); rsort($old); foreach (array_slice($old, 15) as $f) @unlink($f);
  }
  $ok = file_put_contents($FILE, json_encode($in['data'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
  out($ok === false ? ['ok' => false, 'erro' => 'Sem permissão para gravar data.json (ajuste a permissão da pasta para 755/775)'] : ['ok' => true, 'em' => date('H:i:s')], $ok === false ? 500 : 200);
}

if ($a === 'upload') {
  $f = $_FILES['f'] ?? null;
  if (!$f || $f['error'] !== UPLOAD_ERR_OK) out(['ok' => false, 'erro' => 'Falha no envio (arquivo maior que o limite do servidor? código ' . ($f['error'] ?? '?') . ')'], 400);
  $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
  $img = ['jpg', 'jpeg', 'png', 'webp', 'gif']; $vid = ['mp4', 'webm', 'mov', 'm4v'];
  if (!in_array($ext, array_merge($img, $vid))) out(['ok' => false, 'erro' => 'Formato não permitido'], 400);
  if (in_array($ext, $img) && !@getimagesize($f['tmp_name'])) out(['ok' => false, 'erro' => 'Imagem inválida'], 400);
  @mkdir($UP, 0755, true);
  $base = preg_replace('/[^a-z0-9]+/', '-', strtolower(pathinfo($f['name'], PATHINFO_FILENAME))) ?: 'arquivo';
  $name = substr($base, 0, 40) . '-' . substr(md5(uniqid('', true)), 0, 6) . ".$ext";
  if (!move_uploaded_file($f['tmp_name'], "$UP/$name")) out(['ok' => false, 'erro' => 'Não foi possível gravar em imagens/uploads (verifique a permissão da pasta)'], 500);
  out(['ok' => true, 'path' => "imagens/uploads/$name"]);
}
out(['ok' => false, 'erro' => 'Ação desconhecida'], 400);
